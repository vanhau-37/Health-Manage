import React, { Component } from "react";
import { connect } from "react-redux";
import "./HealthStatusManage.scss";
import {
    getAllHealthStatusApi,
    deleteHealthStatusApi,
} from "../../../../services/healthStatusService";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import CustomScrollbars from "../../../../components/CustomScrollbars";

class HealthStatusManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrHealthStatus: [],
            totalPage: 1,
            pageIndex: 0,
        };
    }

    async componentDidMount() {
        await this.getAllHealthStatus(this.state.pageIndex);
    }

    getAllHealthStatus = async (pageIndex) => {
        try {
            let res = await getAllHealthStatusApi(pageIndex);
            if (res.status) {
                this.setState({
                    arrHealthStatus: res.data.healthStatuses,
                    totalPage: res.data.totalPage,
                });
            }
            console.log(this.state.arrHealthStatus);
        } catch (error) {
            if (!error.response.data.status) {
                alert(error.response.data.message);
            }
        }
    };

    handleDeleteHealthStatus = async (item) => {
        try {
            await deleteHealthStatusApi(item.id);
            await this.getAllHealthStatus(this.props.userInfo.nameid);
            toast.success("Xóa thành công");
        } catch (error) {
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    handlePageChange = (pageIndex) => {
        console.log(pageIndex.selected);
        this.setState(
            {
                pageIndex: pageIndex.selected,
            },
            async () => await this.getAllHealthStatus(this.state.pageIndex)
        );
    };

    render() {
        let arrHealthStatus = this.state.arrHealthStatus;
        return (
            <div className="users-container">
                <div className="title text-center">
                    Quản lý tình trạng sức khỏe
                </div>
                <div className="users-table mt-3 mx-1">
                    <CustomScrollbars style={{ height: "475px", with: "100%" }}>
                        <table id="customers">
                            <tbody>
                                <tr>
                                    <th style={{ width: "17%" }}>Họ Tên</th>
                                    <th style={{ width: "17%" }}>Email</th>
                                    <th style={{ width: "8%" }}>Giới Tính</th>
                                    <th style={{ width: "13%" }}>
                                        Số điện thoại
                                    </th>
                                    <th>Chuẩn đoán</th>
                                    <th style={{ width: "15%" }}>Ngày tạo</th>
                                    <th style={{ width: "10%" }}>Hành Động</th>
                                </tr>

                                {arrHealthStatus &&
                                    arrHealthStatus.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.user.fullName}</td>
                                                <td>{item.user.email}</td>
                                                <td>{item.user.gender}</td>
                                                <td>{item.user.phoneNumber}</td>
                                                <td>
                                                    {item.diagnosisOfDisease}
                                                </td>
                                                <td>{new Date(item.createDate).toLocaleDateString("vi-VN") }</td>
                                                <td>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => {
                                                            this.handleDeleteHealthStatus(
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

export default connect(mapStateToProps, mapDispatchToProps)(HealthStatusManage);
