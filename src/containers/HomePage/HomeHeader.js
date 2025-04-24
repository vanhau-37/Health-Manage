import React, { Component } from "react";
import * as actions from "../../store/actions";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { withRouter } from "react-router";

class HomeHeader extends Component {
    handleViewPage = (path) => {
        this.props.history.push(path);
    };

    render() {
        const { processLogout, userInfo, searchedDisease, stringText } =
            this.props;
        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className="left-content">
                            <div
                                className="header-logo"
                                onClick={() => this.handleViewPage("/home")}
                            ></div>
                        </div>
                        <div className="center-content">
                            <div
                                className="child-content"
                                onClick={() =>
                                    this.handleViewPage("/healthstatus")
                                }
                            >
                                <div>
                                    <b>Tình trạng sức khỏe</b>
                                </div>
                                <div className="subs-title">
                                    Cập nhật trạng thái hiện tại
                                </div>
                            </div>
                            <div
                                className="child-content"
                                onClick={() => this.handleViewPage("/disease")}
                            >
                                <div>
                                    <b>Bệnh</b>
                                </div>
                                <div className="subs-title">
                                    Tìm kiếm thông tin bệnh
                                </div>
                            </div>
                        </div>

                        <div className="right-content">
                            {this.props.isShowSearch ? (
                                <div className="search-container">
                                    <input
                                        type="text"
                                        value={stringText}
                                        onChange={(ev) =>
                                            searchedDisease(ev.target.value)
                                        }
                                        placeholder="Tìm bệnh"
                                    />
                                </div>
                            ) : (
                                <div></div>
                            )}
                            <div>
                                <span className="welcome">
                                    {userInfo && userInfo.unique_name
                                        ? `Welcom, ${userInfo.unique_name}!`
                                        : ""}
                                </span>
                                {userInfo ? (
                                    <div
                                        className="btn btn-logout"
                                        onClick={processLogout}
                                        title="Log out"
                                    >
                                        <i className="fas fa-sign-out-alt"></i>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            className="btn-login"
                                            onClick={() => {
                                                this.handleViewPage("/login");
                                            }}
                                        >
                                            Login
                                        </button>

                                        <button
                                            className="btn-register"
                                            onClick={() => {
                                                this.handleViewPage(
                                                    "/register"
                                                );
                                            }}
                                        >
                                            Register
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner && (
                    <div className="home-header-banner">
                        <div className="title1">NỀN TẢNG Y TẾ</div>
                        <div className="title2">
                            THEO DÕI TÌNH TRẠNG SỨC KHỎE
                        </div>
                        <div className="options">
                            <div
                                className="option-child"
                                onClick={(path) =>
                                    this.handleViewPage("/healthstatus")
                                }
                            >
                                THÊM TÌNH TRẠNG SỨC KHỎE NGAY
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        stringText: state.disease.stringText,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        searchedDisease: (stringText) =>
            dispatch(actions.searchedDisease(stringText)),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
