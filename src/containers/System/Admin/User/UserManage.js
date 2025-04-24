import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
    getAllUserApi,
    createUserApi,
    deleteUserApi,
    editUserApi,
} from "../../../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
import { emitter } from "../../../../utils/emitter";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import CustomScrollbars from "../../../../components/CustomScrollbars";

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            errMessage: {
                fullname: "",
                email: "",
                password: "",
                confirmpassword: "",
                phonenumber: "",
            },
            editUser: {},
            totalPage: 1,
            pageIndex: 0,
        };
    }

    async componentDidMount() {
        await this.getAllUser(this.state.pageIndex);
    }

    getAllUser = async (pageIndex) => {
        try {
            let response = await getAllUserApi(pageIndex);
            if (response.status) {
                this.setState({
                    arrUsers: response.data.users,
                    totalPage: response.data.totalPage,
                });
            }
        } catch (error) {
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        });
    };

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        });
    };
    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        });
    };

    createUser = async (data) => {
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
            data.gender = parseInt(data.gender, 10);
            data.role = parseInt(data.role, 10);
            await createUserApi(data);
            await this.getAllUser();
            this.toggleUserModal();
            emitter.emit("EVENT_CLEAR_MODAL_DATA");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.setState({
                    errMessage: {
                        fullname:
                            error.response.data.errors?.FullName?.[0] || "",
                        email: error.response.data.errors?.Email?.[0] || "",
                        password:
                            error.response.data.errors?.Password?.[0] || "",
                        confirmpassword:
                            error.response.data.errors?.ConfirmPassword?.[0] ||
                            "",
                        phonenumber:
                            error.response.data.errors?.PhoneNumber?.[0] || "",
                    },
                });
                if (!error.response.data.status) {
                    toast.error(error.response.data.message);
                }
            }
        }
    };

    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserApi(user.id);
            await this.getAllUser();
            console.log("delete success");
        } catch (error) {
            if (!error.response.data.status) {
                alert(error.response.data.message);
            }
        }
    };

    handleEditUser = async (user) => {
        this.toggleUserEditModal();
        this.setState({ editUser: user });
    };

    doEditUser = async (data) => {
        this.setState({
            errMessage: {
                fullname: "",
                email: "",
                password: "",
                confirmpassword: "",
                phonenumber: "",
            },
        });
        data.gender = parseInt(data.gender, 10);
        data.role = parseInt(data.role, 10);
        try {
            let res = await editUserApi(data);
            await this.getAllUser();
            this.toggleUserEditModal();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.setState({
                    errMessage: {
                        fullname:
                            error.response.data.errors?.FullName?.[0] || "",
                        email: error.response.data.errors?.Email?.[0] || "",
                        password:
                            error.response.data.errors?.PasswordNew?.[0] || "",
                        confirmpassword:
                            error.response.data.errors
                                ?.ConfirmPasswordNew?.[0] || "",
                        phonenumber:
                            error.response.data.errors?.PhoneNumber?.[0] || "",
                    },
                });
                console.log("list err ", this.state.errMessage);
                if (!error.response.data.status) {
                    alert(error.response.data.message);
                }
            }
        }
    };

    handlePageChange = (pageIndex) => {
        console.log(pageIndex.selected);
        this.setState(
            {
                pageIndex: pageIndex.selected,
            },
            async () => await this.getAllUser(this.state.pageIndex)
        );
    };
    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleUserModal={this.toggleUserModal}
                    createUser={this.createUser}
                    listError={this.state.errMessage}
                />

                {this.state.isOpenModalEditUser && (
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleUserEditModal={this.toggleUserEditModal}
                        editUser={this.state.editUser}
                        doEditUser={this.doEditUser}
                        listError={this.state.errMessage}
                    />
                )}
                <div className="title text-center">Quản lý người dùng</div>
                <div className="mx-1">
                    <button
                        className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewUser()}
                    >
                        <i className="fa-solid fa-plus"></i> Thêm người dùng
                    </button>
                </div>
                <div className="users-table mt-3 mx-1">
                    <CustomScrollbars style={{ height: "445px", with: "100%" }}>
                        <table id="customers">
                            <tbody>
                                <tr>
                                    <th>Email</th>
                                    <th>Họ Tên</th>
                                    <th>Giới Tính</th>
                                    <th>Số điện thoại</th>
                                    <th>Vai trò</th>
                                    <th>Hành Động</th>
                                </tr>

                                {arrUsers &&
                                    arrUsers.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.email}</td>
                                                <td>{item.fullName}</td>
                                                <td>{item.gender}</td>
                                                <td>{item.phoneNumber}</td>
                                                <td>
                                                    {item.role
                                                        ? "User"
                                                        : "Admin"}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => {
                                                            this.handleEditUser(
                                                                item
                                                            );
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => {
                                                            this.handleDeleteUser(
                                                                item
                                                            );
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </CustomScrollbars>
                </div>

                <ReactPaginate
                    breakLabel={"..."}
                    breakClassName="page-link"
                    pageCount={this.state.totalPage}
                    marginPagesDisplayed={3}
                    onPageChange={this.handlePageChange}
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-link"
                    nextClassName="page-link"
                    activeClassName="active"
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
