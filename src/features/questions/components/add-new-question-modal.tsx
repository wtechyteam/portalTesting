import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { createQuestion } from "./../../../features/common/questionSlice"; // Assuming you have an action for adding questions
import InputText from "@/components/input/input-text";
import ErrorText from "@/components/typography/error-text";
import { Question } from "@/helper/types"; // Update import based on your types file
import { AppDispatch } from "@/lib/store";

interface Props {
    closeModal: () => void;
    extraObject: any;
}

const INITIAL_QUESTION_OBJ: Question = {
    text: "",
    askedForUserId: "",
    createdAt: "",
    _id: "",
    updatedAt: "",
};

function AddQuestionModalBody({ closeModal }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [questionObj, setQuestionObj] = useState<Question>(INITIAL_QUESTION_OBJ);

    const saveNewQuestion = async () => {
        // Field validations
        if (questionObj.text.trim() === "") {
            return setErrorMessage("Question text is required!");
        }

        // Reset error message and set loading
        setErrorMessage("");
        setLoading(true);

        // Dispatch addQuestion action with question details
        const resultAction = await dispatch(createQuestion({
            text: questionObj.text,
            askedForUserId: questionObj.askedForUserId
        }));

        if (createQuestion.fulfilled.match(resultAction)) {
            // Handle success case
            // dispatch(showNotification({ message: "New Question Added!", status: 1 }));
            closeModal();
        } else {
            // Handle error
            setErrorMessage("Failed to add question.");
        }

        setLoading(false);
    };

    const updateFormValue = (updateType: string, value: string) => {
        setErrorMessage("");
        setQuestionObj({ ...questionObj, [updateType]: value });
    };

    return (
        <>
            <InputText
                type="text"
                value={questionObj.text}
                updateType="text"
                containerStyle="mt-4"
                labelTitle="Question Text"
                updateFormValue={updateFormValue}
            />
            <InputText
                type="text"
                value={questionObj.askedForUserId}
                updateType="askedForUserId"
                containerStyle="mt-4"
                labelTitle="Question For"
                updateFormValue={updateFormValue}
            />
            
            {/* If you have multiple-choice options, add input for options here */}
            {/* Example for an additional text input for options */}
            {/* <InputText
                type="text"
                value={questionObj.options.join(', ')}
                updateType="options"
                containerStyle="mt-4"
                labelTitle="Options (comma-separated)"
                updateFormValue={updateFormValue}
            /> */}

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewQuestion()}>
                    {loading && <span className="loading loading-spinner"></span>} Save
                </button>
            </div>
        </>
    );
}

export default AddQuestionModalBody;
