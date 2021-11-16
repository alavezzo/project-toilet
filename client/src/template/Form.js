import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { ADDTOILET } from '../utils/mutations'
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth'

const ToiletForm = () => {

    // addToilet(overallRating: Int!, location: String!, genderNeutral: String!, cleanliness: Int!, changingTable: Boolean!, handicapAccessible: Int!, toiletPaper: Boolean!, keys: Boolean!, comment: String!): Toilet

    const [addToilet, { error }] = useMutation(ADDTOILET)

    const [formState, setFormState] = useState({ overallRating: '', genderNeutral: '', cleanliness: '', handicapAccessible: '', toiletPaper: '', keys: '', comment: '' });

    // update state based on form input changes
    const handleChange = async event => {
        const { name, value } = event.target;
        console.log(name, value)

        setFormState({
            ...formState,
            [name]: value
        });

        console.log(formState)

    };


    const handleFormSubmit = async event => {

        event.preventDefault();

        const token = Auth.loggedIn() ? Auth.getToken() : null;
        console.log(token)
        if (!token) {
            return false;
        }

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            const location = latitude + 'X' + longitude

            try {
                addToilet({
                    variables: { location: location, ...formState }
                })
            } catch (e) {
                console.error(e)
                console.log(error)
            }

        })

    }

    return (
        <section className="features-icons bg-light text-center">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                            <div className="features-icons-icon d-flex">
                                <i className="bi-window m-auto text-primary"></i>

                                <h1>Please use the following form to review your experience. </h1>

                                <Form onSubmit={handleFormSubmit}>


                                    <FormGroup>
                                        <Label for="overallRating">Overall Score?</Label>
                                        <Input onBlur={handleChange} onChange={handleChange} defaultValue={'1'} type="select" name="overallRating" id="overallRating">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="genderNeutral">Gender Neutral?</Label>
                                        <Input onBlur={handleChange} onChange={handleChange} defaultValue={'No'} type="select" name="genderNeutral" id="genderNeutral">
                                            <option>Yes</option>
                                            <option>No</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="cleanliness">Clean?</Label>
                                        <Input onBlur={handleChange} onChange={handleChange} defaultValue={'1'} type="select" name="cleanliness" id="cleanliness">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="changingTable">Changing Table?</Label>
                                        <Input onBlur={handleChange} onChange={handleChange} defaultValue={'No'} type="select" name="changingTable" id="changingTable">
                                            <option>Yes</option>
                                            <option>No</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="handicapAccessible">Handicap Accessible?</Label>
                                        <Input onBlur={handleChange} onChange={handleChange} defaultValue={'1'} type="select" name="handicapAccessible" id="handicapAccessible">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="toiletPaper">Toilet Paper?</Label>
                                        <Input onBlur={handleChange} onChange={handleChange} defaultValue={'No'} type="select" name="toiletPaper" id="toiletPaper">
                                            <option>Yes</option>
                                            <option>No</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="keys">Key Required?</Label>
                                        <Input onBlur={handleChange} onChange={handleChange} defaultValue={'No'} type="select" name="keys" id="keys">
                                            <option>Yes</option>
                                            <option>No</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="comment">comment</Label>
                                        <Input onBlur={handleChange} onChange={handleChange} type="textarea" id="comment" name="comment" placeholder="Enter a comment"></Input>
                                    </FormGroup>
                                    <Button>Submit</Button>

                                </Form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ToiletForm;