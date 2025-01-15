import React from 'react';
import {Formik, Form, Field} from 'formik';
import {simulate} from "./Games";
import {Button, Col, FormGroup, Row} from "react-bootstrap";

const landsAvailable = [
    'Vesuva',
    'CrumblingVestige',
    'LotusField',
    'EchoingDeeps',
    'GlacialChasm',
    'FieldOfTheDead'
];

const LoopForm = (props: any) => {
    const {handleResults} = props;
    return (
        <Formik
            initialValues={
                {
                    battlefieldInit: {
                        count: 3,
                        landCount: 3,
                        legendaryCount: 0,
                        hasVesuva: false,
                        hasEchoingDeeps: false,
                        hasCrumblingVestige: false,
                        hasLotusField: false,
                        hasGlacialChasm: false,
                        hasFieldOfTheDead: false,
                    },

                    graveyardInit: {
                        count: 0,
                        landCount: 0,
                        legendaryCount: 0,
                        hasVesuva: false,
                        hasEchoingDeeps: false,
                        hasCrumblingVestige: false,
                        hasLotusField: false,
                        hasGlacialChasm: false,
                        hasFieldOfTheDead: false,
                    },

                    deckInit: {
                        count: 88,
                        landCount: 44,
                        legendaryCount: 5,
                        hasVesuva: true,
                        hasEchoingDeeps: true,
                        hasCrumblingVestige: true,
                        hasLotusField: true,
                        hasGlacialChasm: false,
                        hasFieldOfTheDead: false,
                    },
                    nantukoTriggers: 1,
                    floatingMana: 2,
                    timesToLoop: 1000,
                }
            }
            onSubmit={(values) => {
                const results = simulate(values.deckInit, values.graveyardInit, values.battlefieldInit, values.floatingMana, values.nantukoTriggers, values.timesToLoop);
                handleResults(results);
            }}
        >
                <Form>
                    <FormGroup>
                        <Row>
                            <Col md={4} xs={12}>
                                <label htmlFor="nantukoTriggers" className="form-label">Nantuko Triggers on the stack</label>
                                <Field name="nantukoTriggers" className="form-control" type="number"/>
                            </Col>
                            <Col md={4} xs={12}>
                                <label htmlFor="floatingMana" className="form-label">Floating Mana</label>
                                <Field name="floatingMana" type="number" className="form-control"/>
                            </Col>
                            <Col md={4} xs={12}>
                                <label htmlFor="timesToLoop" className="form-label">Times to Loop</label>
                                <Field name="timesToLoop" type="number" className="form-control"/>
                            </Col>
                        </Row>
                    </FormGroup>

                    <div>
                    {['deckInit', 'graveyardInit', 'battlefieldInit'].map(function (title){
                    return <FormGroup>
                        <h4>{title.substring(0, title.length - 4)}</h4>
                        <Row>
                            <Col md={4} xs={12}>
                            <label htmlFor={title + ".count"} className={"form-label"}>Total Cards in zone</label>
                            <Field name={title + ".count"} type="number" className="form-control"/>
                        </Col>
                        <Col md={4} xs={12}>
                        <label htmlFor={title + ".landCount"} className={"form-label"}>Total Lands in zone</label>
                        <Field name={title + ".landCount"} type="number" className="form-control"/>
                        </Col>
                        <Col md={4} xs={12}>
                        <label htmlFor={title + ".legendaryCount"} className={"form-label"}>Legendary lands in zone</label>
                        <Field name={title + ".legendaryCount"} type="number" className="form-control"/>
                        </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <h6>Lands in zone</h6>
                            </Col>

                            <Col md={12} xs={12}>
                                {landsAvailable.map(function(land) {
                                    return <div className="form-check form-check-inline">
                                        <label htmlFor={title + ".has" + land} className={"form-label for"}>{land}</label>
                                        &nbsp;
                                        <Field name={title + ".has" + land} type="checkbox"/>
                                    </div>
                                })}
                            </Col>

                        </Row>
                    </FormGroup>
                    })}
                    </div>
                    <Button type={"submit"}>Submit</Button>
                </Form>
        </Formik>
    );
}

export default LoopForm;