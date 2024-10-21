import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { registerUser } from "./../../../features/common/userSlice"; // Reuse the registerUser logic
import InputText from "@/components/input/input-text";
import ErrorText from "@/components/typography/error-text";
import { Lead } from "@/helper/types";
import { AppDispatch } from "@/lib/store";

interface Props {
    closeModal: () => void;
    extraObject: any;
}

const INITIAL_LEAD_OBJ: Lead = {
    name: "",
    email: "",
    role: "",
    password: ""
};

function AddLeadModalBody({ closeModal }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [leadObj, setLeadObj] = useState<Lead>(INITIAL_LEAD_OBJ);

    const saveNewLead = async () => {
        // Field validations
        if (leadObj.name.trim() === "") return setErrorMessage("Name is required!");
        if (leadObj.email.trim() === "") return setErrorMessage("Email is required!");
        if (leadObj.role.trim() === "") return setErrorMessage("Role is required!");
        if (leadObj.password.trim() === "") return setErrorMessage("Password is required!");

        // Reset error message and set loading
        setErrorMessage("");
        setLoading(true);

        // Dispatch registerUser action with lead details
        const resultAction = await dispatch(registerUser({
            name: leadObj.name,
            email: leadObj.email,
            password: leadObj.password,
            role: leadObj.role
        }));

        if (registerUser.fulfilled.match(resultAction)) {
            // Handle success case
            // dispatch(showNotification({ message: "New Lead Added!", status: 1 }));
            closeModal();
        } else {
            // Handle error
            setErrorMessage("Failed to add lead.");
        }

        setLoading(false);
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
                labelTitle="Email"
                updateFormValue={updateFormValue}
            />

            <select
                value={leadObj.role}
                onChange={(e) => updateFormValue("role", e.target.value)}
                className="input input-bordered w-full mt-4 text-white bg-neutral-800 border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <option value="" className="text-gray-500">Select Role</option>
                <option value="staff" className="text-white">Staff</option>
                <option value="admin" className="text-white">Admin</option>
                <option value="supervisor" className="text-white">Supervisor</option>
            </select>

            <InputText
                type="password"
                value={leadObj.password}
                updateType="password"
                containerStyle="mt-4"
                labelTitle="Password"
                updateFormValue={updateFormValue}
            />

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewLead()}>
                    {loading && <span className="loading loading-spinner"></span>} Save
                </button>
            </div>
        </>
    );
}

export default AddLeadModalBody;
