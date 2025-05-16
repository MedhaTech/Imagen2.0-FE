import React from 'react';


const VideoModal = ({ v, setShow }) => {
    const handleClose = () => setShow(false);
    return (
        <div>
            {/* Add Role */}
            <div className="modal fade" id="add-units" onClick={handleClose} >
                <div className="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                               
                                <div className="modal-body custom-modal-body">
                                    <div style={{ width: '100%', height: '400px' }}>
                                        <iframe src={v}
                                            title="YouTube video player" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            allowfullscreen
                                        ></iframe>
                                    </div>
                                        
                                    <div className="modal-footer-btn">
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Role */}
        </div>
    );
};

export default VideoModal;
