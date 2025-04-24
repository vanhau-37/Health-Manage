import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/Admin/User/UserManage";
import SymptomManage from "../containers/System/Admin/Symptom/SymptomManage";
import DiseaseManage from "../containers/System/Admin/Disease/DiseaseManage";
import Header from "../containers/Header/Header";
import HealthStatusManage from "../containers/System/Admin/HealthStatus/HealthStatusManage";

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;
        if (userInfo.role !== "Admin") {
            return <Redirect to={"/home"} />;
        }
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route
                                path="/system/user-manage"
                                component={UserManage}
                            />
                            <Route
                                path="/system/symptom-manage"
                                component={SymptomManage}
                            />
                            <Route
                                path="/system/disease-manage"
                                component={DiseaseManage}
                            />
                            <Route
                                path="/system/health-status-manage"
                                component={HealthStatusManage}
                            />

                            <Route
                                component={() => {
                                    return <Redirect to={systemMenuPath} />;
                                }}
                            />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
