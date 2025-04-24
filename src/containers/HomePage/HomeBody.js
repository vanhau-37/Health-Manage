import React, { Component } from "react";
import * as actions from "../../store/actions";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { withRouter } from "react-router";

class HomeBody extends Component {
    handleViewPageDisease = () => {
        this.props.history.push("/healthstatus");
    };
    render() {
        const { processLogout, userInfo } = this.props;
        return (
            <React.Fragment>
                <div className="body-container">
                    <h2>Giới thiệu</h2>
                    <p>
                        Website quản lý sức khỏe cá nhân là website giúp người
                        dùng có thể theo theo dõi tình trạng sức khỏe của bản
                        thân bằng cách nhập tình trạng sức khỏe hiện tại, hệ
                        thống có thể lưu trữ các thông tin trạng thái hiện tại
                        của người dùng và sử dụng cho việc dự đoạn tình trạng
                        sức khỏe của người. Giúp người dùng có thể biết được
                        mình có đang mắc bệnh hay không.
                    </p>
                    <p>
                        Các thông tin về các loại bệnh và triệu chứng của bệnh
                        giúp người dùng có thêm thông tin để nhận biết chính xác
                        bệnh mà mình mắc phải.
                    </p>
                </div>
                <div className="footer-container"></div>
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
    connect(mapStateToProps, mapDispatchToProps)(HomeBody)
);
