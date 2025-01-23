/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
import LinkComponent from './LinkComponent';
class detailToDownload extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid bg-white">
                <div className="row">
                    {/* ----------------------------------------- */}
                    {/* -------------questions answers---- */}
                    <div className="col-12">
                        <div style={{ borderStyle: 'solid', margin: '2rem 2rem' }}>
                            <h1 className='text-center pt-3'>Idea submission Details</h1>
                            <div style={{ margin: '1rem 2rem' }}>
                                <h3>College Details</h3>
                            </div>

                            <div style={{ margin: '0.5rem 5rem' }}>
                                <p><b>College Name :</b>{this.props?.ideaDetails?.college_name}</p>
                            </div>
                            <div style={{ margin: '0.5rem 5rem' }}>
                                <p><b>College Type :</b>{this.props?.ideaDetails?.college_type}</p>
                            </div>
                            <div style={{ margin: '2rem 2rem' }}>
                                <p ><b>Team Members :</b>{this.props?.ideaDetails?.team_members}</p>
                            </div>
                            <div style={{ margin: '1rem 2rem' }}>
                                <h3>Idea Status</h3>
                            </div>

                            <div style={{ margin: '0.5rem 5rem' }}>
                                <p ><b>Idea Id :</b>{this.props?.ideaDetails?.challenge_response_id}</p>
                            </div>
                            <div style={{ margin: '0.5rem 5rem' }}>
                                <p ><b>Idea status :</b>{this.props?.ideaDetails?.status}</p>
                            </div>
                            <div style={{ margin: '0.5rem 5rem' }}>
                                <p><b>Submitted By :</b>{this.props?.ideaDetails?.initiated_name}</p>
                            </div>

                            <p className='text-center pt-3'><strong>Theme : </strong>{this.props?.ideaDetails?.theme}</p>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    1. Which category does your idea belong to?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.theme}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    {`2. Describe your idea (in one sentence)`}
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.idea_describe}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    3. Give a title to your idea.
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.title}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    4. What problem does your idea solve?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.solve}
                                </p>
                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >

                                    55. Who are your target customers/users?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.customer}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    6. Explain your idea in detail
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.detail}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    7. What stage is your idea currently at?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails && JSON.parse(this.props?.ideaDetails?.stage).join(", ")}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    8. How unique is your idea compared to existing solutions?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails && JSON.parse(this.props?.ideaDetails?.unique).join(", ")}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    9. Who are your competitors or similar ideas?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.similar}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    10. How will your idea make revenue or sustain itself?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.revenue}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    11. What impact will your idea have on society or the
                                    environment?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.society}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    12. How confident are you in your ability to implement
                                    your idea with your current skill set?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails && JSON.parse(this.props?.ideaDetails?.confident).join(", ")}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    13. What additional support and resources would you need
                                    to implement or get started with your idea ?
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    {this.props?.ideaDetails?.support}
                                </p>

                            </div>

                            <div style={{ margin: '2rem 2rem' }}>
                                <label
                                    htmlFor="teams"
                                    className=""
                                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                                >
                                    14. Upload images/documents & video links related to your
                                    Idea.(total size limit : 50 MB)
                                </label><br />
                                <p style={{ overflowWrap: 'anywhere' }}>
                                    <LinkComponent
                                        item={
                                            this.props?.ideaDetails &&
                                            JSON.parse(this.props?.ideaDetails?.prototype_image)
                                        }
                                    />
                                    <br />
                                    {this.props?.ideaDetails?.prototype_link}
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default detailToDownload;
