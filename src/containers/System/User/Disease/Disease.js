import React, { Component } from "react";
import { connect } from "react-redux";
import "./Disease.scss";
import {
    getAllDiseaseApi,
} from "../../../../services/diseaseService";
import { withRouter } from "react-router";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

class Disease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDisease: [],
            countDisease: 1,
            pageIndex: 0,
        };
    }

    async componentDidMount() {
        await this.getAllDisease(this.props.stringText, this.state.pageIndex);
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.stringText !== this.props.stringText) {
            this.setState(
                {
                    pageIndex: 0,
                },
                async () => await this.getAllDisease(this.props.stringText, this.state.pageIndex)
            );
        }
    }

    getAllDisease = async (stringText, pageIndex) => {
        try {
            let res = await getAllDiseaseApi(stringText, pageIndex);
            if (res.status) {
                this.setState(
                    {
                        arrDisease: res.data.diseases,
                        countDisease: res.data.totalPage,
                    },
                    () => console.log(res)
                );
            }
        } catch (error) {
            if (!error.response.data.status) {
                alert(error.response.data.message);
            }
        }
    };

    handleViewDetailDisease = (item) => {
        this.props.history.push(`/disease/${item.id}`);
    };

    handlePageChange = (pageIndex) => {
        console.log(pageIndex.selected);
        this.setState(
            {
                pageIndex: pageIndex.selected,
            },
            async () => await this.getAllDisease(this.props.stringText, this.state.pageIndex)
        );
    };

    render() {
        let arrDisease = this.state.arrDisease;
        return (
            <>
                {/* <div className="search-container">
                    <div className="search-input">
                        <input type="text" placeholder="Search for a disease" />
                    </div>
                </div> */}
                <div className="disease-container">
                    <div className="box"></div>
                    {arrDisease &&
                        arrDisease.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="disease-content"
                                    onClick={() =>
                                        this.handleViewDetailDisease(item)
                                    }
                                >
                                    <div className="content-up">
                                        <div className="disease-name">
                                            {item.name}
                                        </div>
                                    </div>
                                    <div className="content-down">
                                        <div
                                            className="disease-image"
                                            style={{
                                                backgroundImage: `url(${item.image})`,
                                            }}
                                        ></div>
                                        <div
                                            className="child-content add-width disease-description"
                                            dangerouslySetInnerHTML={{
                                                __html: item.markdownContent,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}

                    <ReactPaginate
                        breakLabel={"..."}
                        breakClassName="page-link"
                        pageCount={this.state.countDisease}
                        marginPagesDisplayed={3}
                        onPageChange={this.handlePageChange}
                        containerClassName="pagination"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-link"
                        nextClassName="page-link"
                        activeClassName="active"
                        forcePage={this.state.pageIndex}
                    />
                </div>
            </>
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
    return {};
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Disease)
);
