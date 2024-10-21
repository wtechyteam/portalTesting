"use client";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getQuestions } from "./../common/questionSlice"; 
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from "@/helper/app-constants";
import TitleCard from "@/components/cards/title-card";
import { openModal } from "../common/modalSlice";
import { Question } from "@/helper/types"; // Import your Question type

const TopSideButtons = () => {
    const dispatch = useAppDispatch();

    const openAddNewQuestionModal = () => {
        dispatch(openModal({ 
            title: "Add New Question", 
            bodyType: MODAL_BODY_TYPES.QUESTION_ADD_NEW 
        }));
    }; 

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={openAddNewQuestionModal}>Add New Question</button>
        </div>
    );
};

function Questions() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { questions } = useAppSelector((state) => state.question); // Assuming questions are stored in a question slice
    const user = useAppSelector((state) => state.user); // Get the user state for role information

    const openDeleteConfirmationModal = (index: number) => {
        dispatch(openModal({ 
            title: "Confirm Deletion", 
            bodyType: MODAL_BODY_TYPES.CONFIRMATION, 
            extraObject: { 
                message: "Are you sure you want to delete this question?", 
                type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE, 
                index: index // Pass the index of the question to delete
            } 
        }));
    };

    // Check if the user is logged in as admin
    useEffect(() => {
        
            dispatch(getQuestions()); // Fetch the questions if user is admin
        
    }, [user.role, dispatch, router]);

    return (
        <>
        <TitleCard title="Appraisal Questions" topMargin="mt-2" TopSideButtons={user.role === 'admin' ? <TopSideButtons /> : null}>
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Directed To</th>
                            <th>Created At</th>
                            {/* <th>Actions</th> Add actions column */}
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q: Question, k: number) => (
                            <tr key={k}>
                                <td>{q.text}</td>
                                <td>{q.askedForUserId.name}</td>
                                <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                                {/* <td> */}
                                    {/* <button className="btn btn-danger" onClick={() => openDeleteConfirmationModal(k)}>Delete</button> Pass the index here */}
                                {/* </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TitleCard>
    </>
    );
}

export default Questions;
