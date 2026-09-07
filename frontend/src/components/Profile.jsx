function Profile() {
    const username = localStorage.getItem("username") || "User";

    return (
        <section className="page-section">

            <div className="page-header">
                <div>
                    <h1>Profile</h1>

                    <p>
                        Manage your account information
                    </p>
                </div>
            </div>


            <div className="profile-container">

                {/* Profile Header */}

                <div className="profile-card">

                    <div className="profile-avatar">
                        {username.charAt(0).toUpperCase()}
                    </div>

                    <h2>
                        {username}
                    </h2>

                    <p>
                        Expense Tracker User
                    </p>

                </div>


                {/* Account Information */}

                <div className="profile-card account-card">

                    <h3>
                        Account Information
                    </h3>


                    <div className="profile-row">

                        <span>
                            Username
                        </span>

                        <strong>
                            {username}
                        </strong>

                    </div>


                    <div className="profile-row">

                        <span>
                            Authentication
                        </span>

                        <strong>
                            Token Authentication
                        </strong>

                    </div>


                    <div className="profile-row">

                        <span>
                            Account Status
                        </span>

                        <strong className="active-status">
                            ● Active
                        </strong>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Profile;