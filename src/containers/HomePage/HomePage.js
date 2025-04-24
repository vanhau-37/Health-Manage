import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import HomeBody from "./HomeBody";

class HomePage extends Component {
    render() {
        return (
            <div>
                <HomeHeader isShowBanner={true} />
                <HomeBody/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
