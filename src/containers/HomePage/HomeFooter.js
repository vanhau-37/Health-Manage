import React, { Component } from "react";
import * as actions from "../../store/actions";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { withRouter } from "react-router";

class HomeFooter extends Component {
    handleViewPageDisease = () => {
        this.props.history.push("/healthstatus");
    };
    render() {
        return (
            <React.Fragment>
                <div className="footer-container" style={{ fontSize: "17px" }}>
                    <div className="footer-content">
                        <div className="left-content">
                            Chủ sở hữu
                            <div>Mai Văn Hậu</div>
                            <div>SDT: 0905980594</div>
                        </div>
                        <div className="right-content">
                            Liên kết nhanh
                            <div className="bottom-content">
                                <div className="icon">
                                    <a
                                        href="https://www.facebook.com/mvhau.0307"
                                        target="_blank"
                                    >
                                        <i className="fa-brands fa-facebook fa-2x"></i>
                                    </a>
                                </div>
                                <div className="icon">
                                    <a href="mailto:maivanhau0307@gmail.com">
                                        <i
                                            className="fa-brands fa-google-plus fa-2x"
                                            style={{ color: "red" }}
                                        ></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(HomeFooter)
);
