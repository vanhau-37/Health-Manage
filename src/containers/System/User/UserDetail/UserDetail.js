import { Component } from "react";
import { connect } from "react-redux";
import "./UserDetail.scss";
import {
    getAllUserByIdApi,
    editUserInfoApi,
} from "../../../../services/userService";
import { toast } from "react-toastify";

class UserDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            fullName: "",
            gender: "0",
            phoneNumber: "",
            email: "",
            password: "",
            passwordNew: "",
            errMessage: {
                fullname: "",
                email: "",
                password: "",
                confirmpassword: "",
                phonenumber: "",
            },
        };
    }

    getUserById = async (id) => {
        try {
            let res = await getAllUserByIdApi(id);
            if (res.status) {
                this.setState({
                    fullName: res.data.fullName,
                    gender:
                        res.data.gender === "Male"
                            ? 0
                            : res.data.gender === "Female"
                            ? 1
                            : 2,
                    phoneNumber: res.data.phoneNumber,
                    email: res.data.email,
                    password: "",
                    passwordNew: "",

                });
            }
        } catch (error) {
            if (!error.response.data.status) {
                alert(error.response.data.message);
            }
        }
    };

    async componentDidMount() {
        if (this.props.userInfo) {
            this.setState(
                {
                    id: this.props.userInfo.nameid,
                },
                async () => await this.getUserById(this.state.id)
            );
        }
        console.log("mount");
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setState({
                id: this.props.userInfo.nameid,
            });
            await this.getUserById(this.props.userInfo.nameid);
            console.log("ud");
        }
    }

    handleOnChangeInput = (ev, name) => {
        let copyState = { ...this.state };
        name === "gender"
            ? (copyState[name] = parseInt(ev.target.value, 10))
            : (copyState[name] = ev.target.value);
        this.setState(
            {
                ...copyState,
            },
            () => console.log(this.state)
        );
    };

    handleSave = async (info) => {
        this.setState({
            errMessage: {
                fullname: "",
                email: "",
                password: "",
                confirmpassword: "",
                phonenumber: "",
            },
        });
        try {
            await editUserInfoApi(info);
            toast.success("Luu thành công");
            await this.getUserById(this.props.userInfo.nameid);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
                this.setState({
                    errMessage: {
                        fullName:
                            error.response.data.errors?.FullName?.[0] || "",
                        phoneNumber:
                            error.response.data.errors?.PhoneNumber?.[0] || "",
                        password:
                            error.response.data.errors?.Password?.[0] || "",
                        passwordNew:
                            error.response.data.errors?.PasswordNew?.[0] || "",
                    },
                });
            }
        }
    };

    render() {
        return (
            <>
                <div className="box"></div>
                <div className="userdetail-backgroud">
                    <div className="userdetail-container">
                        <div className="userdetail-content row">
                            <div className="col-12 text-userdetail">
                                Thông tin cá nhân
                            </div>
                            <div className="col-6 form-group userdetail-input">
                                <label>Họ tên:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập họ tên"
                                    value={this.state.fullName}
                                    onChange={(ev) => {
                                        this.handleOnChangeInput(
                                            ev,
                                            "fullName"
                                        );
                                    }}
                                />
                                <div className="col-12 err-message">
                                    {this.state.errMessage.fullName}
                                </div>
                            </div>
                            <div className="col-6 form-group userdetail-input">
                                <label>Giới tính:</label>
                                <select
                                    className="form-control"
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
                            <div className="col-12 form-group userdetail-input">
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập số điện thoại"
                                    value={this.state.phoneNumber}
                                    onChange={(ev) => {
                                        this.handleOnChangeInput(
                                            ev,
                                            "phoneNumber"
                                        );
                                    }}
                                />
                                <div className="col-12 err-message">
                                    {this.state.errMessage.phoneNumber}
                                </div>
                            </div>
                            <div className="col-12 form-group userdetail-input">
                                <label>Tài khoản:</label>
                                <div
                                    className="form-control"
                                    style={{ background: "#dbdbdb" }}
                                >
                                    {this.state.email}
                                </div>

                                <div className="col-12 err-message">
                                    {this.state.errMessage.email}
                                </div>
                            </div>

                            <div className="col-12 form-group userdetail-input">
                                <label>Mật khẩu hiện tại:</label>

                                <div className="custom-input-password">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Nhập mật khẩu"
                                        value={this.state.password}
                                        onChange={(ev) => {
                                            this.handleOnChangeInput(
                                                ev,
                                                "password"
                                            );
                                        }}
                                    />
                                </div>
                                <div className="col-12 err-message">
                                    {this.state.errMessage.password}
                                </div>
                            </div>

                            <div className="col-12 form-group userdetail-input">
                                <label>Mật khẩu mới:</label>

                                <div className="custom-input-password">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhập mật khẩu"
                                        value={this.state.passwordNew}
                                        onChange={(ev) => {
                                            this.handleOnChangeInput(
                                                ev,
                                                "passwordNew"
                                            );
                                        }}
                                    />
                                </div>
                                <div className="col-12 err-message">
                                    {this.state.errMessage.passwordNew}
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-center">
                                <div className="col-5">
                                    <button
                                        className="btn-userdetail"
                                        onClick={() => {
                                            this.handleSave(this.state);
                                        }}
                                    >
                                        Lưu thông tin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
