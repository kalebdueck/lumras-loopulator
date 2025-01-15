import React from 'react';
import {Field} from "formik";

const DeckInfo = (field: any, form: {touched: any, errors: any}, props: any) => {

    console.log(field);
    console.log(form);
    console.log(props);

    return (
        <div>
                <Field name="field.count" type="number"/>
        </div>

    );
};

export default DeckInfo;