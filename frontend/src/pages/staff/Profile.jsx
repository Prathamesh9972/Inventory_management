import React from "react";
import Header from "../../components/Header";
import StaffHeader from "../../components/StaffHeader";

function Profile() {
    const user=JSON.parse(localStorage.getItem("user"))

    return (
        <div>
            <StaffHeader/>
            <br/>
            <h2 className="font-bold">User Profile</h2>
            <div className="d-flex m-2 p-4 flex-col">
            <p className="text-3xl font-bold">Username : {user.username}</p>
             <p className="text-3xl font-bold">UserId: {user.id}</p>
             <p className="text-3xl font-bold">Role: {user.role}</p>
            </div>
             
        </div>
    )
}
export default Profile;