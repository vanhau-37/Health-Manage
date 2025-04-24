import React, { Component } from "react";
import { connect } from "react-redux";
import "./DiseaseDetail.scss";
import { getDiseaseByIdApi } from "../../../../services/diseaseService";
import { emitter } from "../../../../utils/emitter";
import { toast } from "react-toastify";
import HomeHeader from "../../../HomePage/HomeHeader";

class DiseaseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diseaseDetail: {},
            id: 0,
        };
    }

    async componentDidMount() {
        let paramId = this.props.match.params.id;
        paramId && this.setState({
            id: paramId,
        },async () => {await this.getDiseaseById(this.state.id);})
        
    }

    getDiseaseById = async (id) => {
        try {
            let res = await getDiseaseByIdApi(id);
            if (res.status) {console.log(res)
                this.setState(
                    {
                        diseaseDetail: res.data,
                    });
            }
        } catch (error) {
            if (!error.response.data.status) {
                toast.error(error.response.data.message);
            }
        }
    };

    async componentDidUpdate(prevProps) {}

    handleBack = () => {
        this.props.history.push("/disease");
    };

    render() {
        let { diseaseDetail } = this.state;
        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <div className="box"></div>
                <div className="btutton-back">
                    <button
                        onClick={() => {
                            this.handleBack();
                        }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                </div>

                <div className="disease-detail-container">
                    <div className="title">{diseaseDetail.name}</div>

                    <div className="group-content">
                        <div
                            className="image"
                            style={{
                                backgroundImage: `url(${
                                    diseaseDetail.image ||
                                    "../../../../assets/no-image.jpg"
                                })`,
                            }}
                        ></div>
                        <div className="symptom">
                            <p>Triệu chứng bệnh:</p>
                            <ul>
                                {diseaseDetail.listSymptom &&
                                    diseaseDetail.listSymptom.map(
                                        (item, index) => {
                                            return (
                                                <li key={index}>
                                                    {item.name}:{" "}
                                                    {item.description}
                                                </li>
                                            );
                                        }
                                    )}
                            </ul>
                        </div>
                    </div>

                    <div
                        className="description"
                        dangerouslySetInnerHTML={{
                            __html: diseaseDetail.markdownContent,
                        }}
                    >
                        
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DiseaseDetail);
