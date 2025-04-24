import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Disease from "./Disease";
import HomeHeader from "../../../HomePage/HomeHeader";

class DiseasePage extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <React.Fragment>
                <HomeHeader isShowSearch={true} />
                <Disease />
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

export default connect(mapStateToProps, mapDispatchToProps)(DiseasePage);
