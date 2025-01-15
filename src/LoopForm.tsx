import React from 'react';
import {Formik, Form, Field} from 'formik';
import DeckInfo from "./DeckInfo";
import {simulate} from "./Games";

const LoopForm = () => {
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
                    },

                    graveyardInit: {
                        count: 0,
                        landCount: 0,
                        legendaryCount: 0,
                        hasVesuva: false,
                        hasEchoingDeeps: false,
                        hasCrumblingVestige: false,
                        hasLotusField: false,
                    },

                    deckInit: {
                        count: 88,
                        landCount: 44,
                        legendaryCount: 5,
                        hasVesuva: true,
                        hasEchoingDeeps: true,
                        hasCrumblingVestige: true,
                        hasLotusField: true,
                    },
                    nantukoTriggers: 1,
                    floatingMana: 2,
                    timesToLoop: 1000,

                }
            }
            onSubmit={(values) => {
                const results = simulate(values.deckInit, values.graveyardInit, values.battlefieldInit, values.floatingMana, values.nantukoTriggers, values.timesToLoop);
                console.log(results);
            }}
        >
            {({values, handleChange, handleSubmit}) => (
                <Form>


                    <Field name="nantukoTriggers" type="number"/>
                    <Field name="floatingMana" type="number"/>
                    <Field name="timesToLoop" type="number"/>

                    <Field name="deckInit" component={DeckInfo} title={"Deck Data"} hello={"fsd"}/>


                    <button type="submit">Submit</button>
                </Form>
            )}
        </Formik>
    );
}

export default LoopForm;