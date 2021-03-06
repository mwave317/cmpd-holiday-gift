// @flow
import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Form } from 'neoform';
import { FormValidation } from 'neoform-validation';

import Box from '../../components/box';
import Input from 'app/components/input';
import requiredValidator from 'lib/validators/required.validator';

import { createClient } from '@google/maps';

declare var process: {env: {REACT_APP_GOOGLE_MAPS_API_KEY?: string}};

const googleMaps = createClient({ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY });
//const googleMaps = createClient({ key: 'AIzaSyDWh6KPo-ZLszznFlFRzce_XsIv2nZ2YXY' });

class AddressForm extends React.Component<{| onSubmit: *, validate: *, onInvalid: * |}> {
  addressRefs: {
    city?: ?HTMLInputElement,
    state?: ?HTMLInputElement,
    zip?: ?HTMLInputElement
  };

  constructor() {
    super();
    this.addressRefs = {};
  }

  async autoCompleteAddressFields(ev: FocusEvent): Promise<void> {
    const response = await new Promise((ok, fail) => googleMaps.geocode({
      'address': (ev.target: any).value,
      'region': 'US'
      //'componentRestrictions': { 'administrativeArea': 'North Carolina' }
    }, (err, res) => err ? fail(err) : ok(res)));
    const result = response.json.results[0];
    if (result.address_components.length < 3) {
      // address not found
      return;
    }
    for (const i in result.address_components) {
      const val = result.address_components[i];
      switch (val.types[0]) {
      case 'locality':
        if (this.addressRefs.city) {
          this.addressRefs.city.value = val.long_name;
        }
        break;
      case 'administrative_area_level_1':
        if (this.addressRefs.state) {
          this.addressRefs.state.value = val.long_name;
        }
        break;
      case 'postal_code':
        if (this.addressRefs.zip) {
          this.addressRefs.zip.value = val.long_name;
        }
        break;
      default:
        break;
      }
    }
    this.autoCompleteCmpdInfo(result.geometry.location.lat, result.geometry.location.lng);
  }

  autoCompleteCmpdInfo(_lat, _lng) {
    // TODO
  }

  render(): React.Node {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.props.validate(this.props.onSubmit, this.props.onInvalid);
        }}
      >
        <Row>
          <Col xs={12}>
            <Box title="Delivery Address" bsStyle="danger">
              <Row>
                <Col md={4} xs={12}>
                  <Input
                    label="Type"
                    controlId="formControlsSelect"
                    name="address.deliveryAddressType"
                    componentClass="select"
                    placeholder="select"
                    validator={requiredValidator}
                  >
                    <option value="">Select...</option>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                  </Input>
                </Col>
                <Col md={4} xs={12}>
                  <Input
                    label="Street Address"
                    id="streetAddress"
                    name="address.addressLine1"
                    type="text"
                    validator={requiredValidator}
                    autoComplete="shipping address-line1"
                    onBlur={this.autoCompleteAddressFields.bind(this)}
                  />
                </Col>
                <Col md={4} xs={12}>
                  <Input
                    label="Street Address 2"
                    id="streetAddress"
                    name="address.addressLine2"
                    type="text"
                    autoComplete="shipping address-line2"
                  />
                </Col>
              </Row>
              <Row>
                <Col md={4} xs={12}>
                  <Input
                    label="City"
                    id="city"
                    name="address.city"
                    type="text"
                    validator={requiredValidator}
                    autoComplete="shipping locality city"
                    inputRef={(el) => this.addressRefs.city = el}
                  />
                </Col>
                <Col md={4} xs={12}>
                  <Input
                    label="State"
                    id="state"
                    name="address.state"
                    type="text"
                    validator={requiredValidator}
                    autoComplete="shipping region state"
                    inputRef={(el) => this.addressRefs.state = el}
                  />
                </Col>
                <Col md={4} xs={12}>
                  <Input
                    label="Zip Code"
                    id="zip"
                    name="address.zip"
                    type="text"
                    validator={requiredValidator}
                    pattern="(\d{5}([\-]\d{4})?)"
                    maxLength="5"
                    autoComplete="shipping postal-code"
                    inputRef={(el) => this.addressRefs.zip = el}
                  />
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
      </form>
    );
  }
}

export default Form(FormValidation(AddressForm));
