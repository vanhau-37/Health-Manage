import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from 'lodash';

class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:0,
            fullname: "",
            gender: "0",
            email: "",
            password: "",
            passwordnew: "",
            confirmpasswordnew: "",
            phonenumber: "",
            role: "1",
        };
    }

    componentDidMount() {
        let user = this.props.editUser;
        if (user && !_.isEmpty(user)) {
            this.setState({
                id:user.id,
                fullname: user.fullName,
                gender: user.gender === "Male" ? 0 : (user.gender === "Female"?1:2),
                email: user.email,
                passwordnew: "",
                confirmpasswordnew: "",
                phonenumber: user.phoneNumber,
                role: user.role,
            });
        }
    }

    toggle = () => {
        this.props.toggleUserEditModal();
    };

    handleOnChangeInput = (ev, id) => {
        let copyState = { ...this.state };
        copyState[id] = ev.target.value;
        this.setState({
            ...copyState,
        });
    };

    handlEditUser = () => {
        this.props.doEditUser(this.state);
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => {
                    this.toggle();
                }}
                className={"modal-user-container"}
                size="lg"
            >
                <ModalHeader
                    toggle={() => {
                        this.toggle();
                    }}
                >
                    Sửa Thông Tin Người Dùng
                </ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Họ tên</label>
                            <input
                                type="text"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "fullname");
                                }}
                                value={this.state.fullname}
                            />
                            <div className="err-message">
                                {this.props.listError.fullname || ""}
                            </div>
                        </div>
                        <div className="input-container">
                            <label>Giới tính</label>
                            <select
                                name="gender"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "gender");
                                }}
                                value={this.state.gender}
                            >
                                <option value="0">Nam</option>
                                <option value="1">Nữ</option>
                                <option value="2">Khác</option>
                            </select>
                        </div>
                        <div className="input-container max-width-input">
                            <label>Email</label>
                            <input
                                type="text"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "email");
                                }}
                                value={this.state.email}
                            />
                            <div className="err-message">
                                {this.props.listError.email || ""}
                            </div>
                            
                        </div>
                        <div className="input-container max-width-input">
                            <label>Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "password");
                                }}
                                value={this.state.password}
                            />
                            {/* <div className="err-message">
                                { this.state.password ||"Vui lòng nhập mật khẩu hiện tại"}
                            </div> */}
                        </div>
                        <div className="input-container">
                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "passwordnew");
                                }}
                                value={this.state.passwordnew}
                            />
                            <div className="err-message">
                                {this.props.listError.password || ""}
                            </div>
                        </div>
                        <div className="input-container">
                            <label>Nhập lại mật khẩu mới</label>
                            <input
                                type="password"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(
                                        ev,
                                        "confirmpasswordnew"
                                    );
                                }}
                                value={this.state.confirmpasswordnew}
                            />
                            <div className="err-message">
                                {this.props.listError.confirmpassword || ""}
                            </div>
                        </div>
                        <div className="input-container">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "phonenumber");
                                }}
                                value={this.state.phonenumber}
                            />
                            <div className="err-message">
                                {this.props.listError.phonenumber || ""}
                            </div>
                        </div>
                        <div className="input-container">
                            <label>Vai trò</label>
                            <select
                                name="role"
                                onChange={(ev) => {
                                    this.handleOnChangeInput(ev, "role");
                                }}
                                value={this.state.role}
                            >
                                <option value="0">Admin</option>
                                <option value="1">User</option>
                            </select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        className="px-3"
                        onClick={() => {
                            this.handlEditUser();
                        }}
                    >
                        Cập nhật
                    </Button>{" "}
                    <Button
                        color="secondary"
                        className="px-3"
                        onClick={() => {
                            this.toggle();
                        }}
                    >
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
