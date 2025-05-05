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
        return (
            <React.Fragment>
                <div className="body-container" style={{ fontSize: "17px" }}>
                    <h2>Giới thiệu</h2>
                    <p>
                        Website Quản Lý Sức Khỏe Cá Nhân là một hệ thống hỗ trợ
                        người dùng trong việc theo dõi tình trạng sức khỏe của
                        bản thân một cách chủ động, đơn giản và thông minh.
                        Website hướng đến mục tiêu giúp người dùng:
                    </p>
                    <ul>
                        <li>
                            Ghi lại và quản lý triệu chứng, chỉ số sức khỏe theo
                            thời gian.
                        </li>
                        <li>
                            Tìm hiểu thông tin về các bệnh và triệu chứng của
                            bệnh, những thông tin đáng lưu ý và các phòng ngừa
                            bệnh.
                        </li>
                        <li>
                            Đưa ra chuẩn đoán bệnh dựa trên triệu chứng người
                            dùng cung cấp.
                        </li>
                        <li>
                            Đưa ra chuẩn đoán bệnh dựa trên triệu chứng người
                            dùng cung cấp.
                        </li>
                        <li>Tăng khả năng nhận biết bệnh sớm.</li>
                    </ul>
                    <hr></hr>
                    <h2>Các tính năng chính</h2>
                    <h3>📝 Tình trạng sức khỏe</h3>
                    <ul>
                        <li>
                            Người dùng có thể thêm, cập nhật, xóa, các tình
                            trạng sức khỏe mà mình đã ghi nhận theo từng thời
                            điểm.
                        </li>
                        <li>Kiểm tra bệnh dựa trên triệu chứng.</li>
                        <li>
                            Mỗi tình trạng gồm: triệu chứng, cân nặng, chiều
                            cao, nhiệt độ, ngày ghi nhận.
                        </li>
                    </ul>
                    <h3>🔍 Tìm kiếm thông tin bệnh</h3>
                    <ul>
                        <li>
                            Cho phép người dùng tìm kiếm thông tin về các loại
                            bệnh dựa trên tên bệnh.
                        </li>
                        <li>
                            Hiển thị chi tiết: mô tả bệnh, triệu chứng, tác nhân,
                            đường lây truyền, đối tượng dễ bị ảnh hưởng nặng, phòng ngừa.
                        </li>
                    </ul>
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
    connect(mapStateToProps, mapDispatchToProps)(HomeBody)
);
