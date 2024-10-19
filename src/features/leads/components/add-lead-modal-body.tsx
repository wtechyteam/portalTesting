import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { addNewLead } from "../leadSlice";
import InputText from "@/components/input/input-text";
import ErrorText from "@/components/typography/error-text";
import { Lead } from "@/helper/types";

interface Props {
    closeModal: () => void;
    extraObject: any;
}

const INITIAL_LEAD_OBJ: Lead = {
    name: "",
    email: "",
    role: "", // Role added to the initial lead object
};

function AddLeadModalBody({ closeModal }: Props) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [leadObj, setLeadObj] = useState<Lead>(INITIAL_LEAD_OBJ);

    const saveNewLead = () => {
        if (leadObj.name.trim() === "") return setErrorMessage("Name is required!");// Added validation for Name
        else if (leadObj.email.trim() === "") return setErrorMessage("Email id is required!");
        else if (leadObj.role.trim() === "") return setErrorMessage("Role is required!"); // Added validation for Role
        else {
            const newLeadObj: Lead = {
                id: 7,
                email: leadObj.email,
                name: leadObj.name,
                role: leadObj.role,
            };
            dispatch(addNewLead({ newLeadObj }));
            dispatch(showNotification({ message: "New Lead Added!", status: 1 }));
            closeModal();
        }
    };

    const updateFormValue = (updateType: string, value: string) => {
        setErrorMessage("");
        setLeadObj({ ...leadObj, [updateType]: value });
    };

    return (
        <>
            <InputText
                type="text"
                value={leadObj.name}
                updateType="name"
                containerStyle="mt-4"
                labelTitle="Name"
                updateFormValue={updateFormValue}
            />

            <InputText
                type="email"
                value={leadObj.email}
                updateType="email"
                containerStyle="mt-4"
                labelTitle="Email Id"
                updateFormValue={updateFormValue}
            />

            <InputText
                type="text"
                value={leadObj.role} // New Role input field
                updateType="role"
                containerStyle="mt-4"
                labelTitle="Role"
                updateFormValue={updateFormValue}
            />

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
            </div>
        </>
    );
}

export default AddLeadModalBody;
