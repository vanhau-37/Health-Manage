import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import HealthStatus from "./HealthStatus";
import HomeHeader from "../../../HomePage/HomeHeader";

class HealthStatusPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <HealthStatus />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthStatusPage);
