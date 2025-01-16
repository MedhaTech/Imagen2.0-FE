// /* eslint-disable no-unused-vars */
// /* eslint-disable indent */
// import React from 'react';
// import LinkComponent from '../../../../Teacher/Dashboard/LinkComponent';
// import IdeaPage1 from '../../../../assets/img/idea report/idea_page1.png';
// import IdeaPage2 from '../../../../assets/img/idea report/idea_page2.jpg';
// import IdeaPage3 from '../../../../assets/img/idea report/idea_page3.jpg';
// import moment from 'moment';
// // const detailToDownload = (props) => {
// class detailToDownload extends React.Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return (
//             <div className="container-fluid bg-white">
//                 <div className="row">
//                     <div style={{ position: 'relative', padding: '0' }}>
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '27rem',
//                                 left: '15rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.organization_code}
//                         </span>
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '29rem',
//                                 left: '17rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.organization_name}
//                         </span>
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '31rem',
//                                 left: '13rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.state}
//                         </span>
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '33rem',
//                                 left: '15rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.category}
//                         </span>
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '41.2rem',
//                                 left: '14rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.mentor_name}
//                         </span>
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '43.2rem',
//                                 left: '20rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.team_username}
//                         </span>
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '45.3rem',
//                                 left: '17rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.team_name}
//                         </span>
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '47.2rem',
//                                 left: '19rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins',
//                                 overflowWrap: 'anywhere',
//                                 width: '60%'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.team_members &&
//                                 this.props?.ideaDetails?.team_members.toString()}
//                         </span>
//                         <span
//                             style={{
//                                 position: 'absolute',
//                                 top: '58.8rem',
//                                 left: '14rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins',
//                                 fontWeight: 'bold'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.challenge_response_id
//                             }
//                         </span>
//                         <span
//                             style={{
//                                 position: 'absolute',
//                                 top: '60.8rem',
//                                 left: '15rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'Poppins',
//                                 overflowWrap: 'anywhere',
//                                 width: '65%'
//                             }}
//                         >
//                             {this.props?.ideaDetails?.title}
//                         </span>

//                         <img
//                             src={IdeaPage1}
//                             alt="IdeaPage1"
//                             style={{
//                                 height: '83rem',
//                                 width: '100%'
//                             }}
//                         />
//                     </div>
//                     <div style={{ position: 'relative', padding: '0' }}>
//                         <img
//                             src={IdeaPage2}
//                             alt="IdeaPage2"
//                             style={{
//                                 width: '100%'
//                             }}
//                         />
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '7rem',
//                                 left: '5rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'poppins'
//                             }}
//                         >
//                             <span
//                                 style={{
//                                     fontWeight: 'bold',
//                                     padding: '0.5rem',
//                                     backgroundColor: '#FFBB3F',
//                                     borderRadius: '5px'
//                                 }}
//                             >
//                                 Last modified by :
//                             </span>{' '}
//                             {this.props?.ideaDetails?.initiated_name}
//                         </span>
//                         <span
//                             className="text-capitalize"
//                             style={{
//                                 position: 'absolute',
//                                 top: '7rem',
//                                 left: '30rem',
//                                 fontSize: '1rem',
//                                 fontFamily: 'poppins'
//                             }}
//                         >
//                             <span
//                                 style={{
//                                     fontWeight: 'bold',
//                                     padding: '0.5rem',
//                                     backgroundColor: '#FFBB3F',
//                                     borderRadius: '5px'
//                                 }}
//                             >
//                                 Idea status :
//                             </span>{' '}
//                             {this.props?.ideaDetails?.status}
//                         </span>
//                     </div>

//                     {/* ----------------------------------------- */}
//                     {/* -------------questions answers---- */}
//                     <div className="col-12">
//                         <div style={{ borderStyle: 'solid', margin: '0 2rem' }}>
//                             <p className='text-center pt-3'><strong>Theme : </strong>{this.props?.ideaDetails?.theme}</p>
//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     Idea Submission Language
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.language}
//                                 </p>

//                             </div>
//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     1. Focus Area
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.focus_area}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     {`2. Title of your idea (Think of a proper name. Don't describe the solution or problem statement here.)`}
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.title}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     3. Write down your Problem statement
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.problem_statement}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     4. List the Causes of the problem
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.causes}
//                                 </p>
//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >

//                                     5. List the Effects of the problem
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.effects}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     6. In which places in your community did you find this problem?
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.community}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     7. Who all are facing this problem?
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.facing}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     8. Describe the solution to the problem your team found. Explain your solution clearly - how does it work, who is it helping, and how will it solve the problem.
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.solution}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     9. Apart from your teacher, how many people/stakeholders did you speak to to understand or improve your problem or solution?
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.stakeholders}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     10. Pick the actions your team did in your problem solving journey (You can choose multiple options)
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                 {(() => {
//       const problemSolving = this.props?.ideaDetails?.problem_solving;
//       console.log('problemSolving:', problemSolving);
//       try {
//         const parsedData = JSON.parse(problemSolving);

//         return Array.isArray(parsedData) ? parsedData.join(", ") : problemSolving;
//       } catch (e) {
//         return problemSolving;
//       }
//     })()}
//                                     {/* {this.props?.ideaDetails?.problem_solving && JSON.parse(this.props.ideaDetails.problem_solving).join(", ")} */}
//                                 </p>
                              
//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     11. Mention the feedback that your team got and the changes you have made, if any, to your problem or solution.
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.feedback}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     12.  Upload image of your prototype.  (total size limit : 10mb)
//                                 </label><br />
//                                 <LinkComponent
//                                     item={
//                                         this.props?.ideaDetails &&
//                                         JSON.parse(this.props?.ideaDetails?.prototype_image)
//                                     }
//                                 />
//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     13. Upload documents & video links of your prototype.
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.prototype_link}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 <label
//                                     htmlFor="teams"
//                                     className=""
//                                     style={{ fontSize: '1rem', fontWeight: 'bold' }}
//                                 >
//                                     14.   Did your team complete and submit the workbook to your school Guide teacher?
//                                 </label><br />
//                                 <p style={{ overflowWrap: 'anywhere' }}>
//                                     {this.props?.ideaDetails?.workbook}
//                                 </p>

//                             </div>

//                             <div style={{ margin: '2rem 2rem' }}>
//                                 {this.props?.ideaDetails?.verified_status == "ACCEPTED" && (
//                                     <div>
//                                         <p style={{ fontSize: "1rem" }} className="fw-bold">
//                                             Accepted At :{" "}
//                                             {this.props?.ideaDetails?.verified_at
//                                                 ? moment(this.props?.ideaDetails?.verified_at).format(
//                                                     "DD-MM-YYYY"
//                                                 )
//                                                 : "-"}
//                                         </p>
//                                     </div>
//                                 )}

//                                 {this.props?.ideaDetails?.verified_status === "REJECTED" && (
//                                     <div>
//                                         <p style={{ fontSize: "1rem" }} className="fw-bold">
//                                             Last Modifiled By :{" "}
//                                             {this.props?.ideaDetails?.initiated_name}
//                                         </p>
//                                         <p style={{ fontSize: "1rem" }} className="fw-bold">
//                                             Rejected At :{" "}
//                                             {this.props?.ideaDetails?.verified_at
//                                                 ? moment(this.props?.ideaDetails?.verified_at).format(
//                                                     "DD-MM-YYYY"
//                                                 )
//                                                 : "-"}
//                                         </p>
//                                         <p style={{ fontSize: "1rem" }} className="fw-bold">
//                                             Reason for Rejection :{" "}
//                                             {this.props?.ideaDetails?.mentor_rejected_reason}
//                                         </p>
//                                     </div>
//                                 )}

//                                 {this.props?.ideaDetails?.status === "SUBMITTED" && (
//                                     <div>
//                                         <p style={{ fontSize: "1rem" }} className="fw-bold">
//                                             Submitted By : {this.props?.ideaDetails?.initiated_name}
//                                         </p>
//                                     </div>
//                                 )}

//                                 {this.props?.ideaDetails?.status === "DRAFT" && this.props?.ideaDetails?.verified_status === null && (
//                                     <div>
//                                         <p style={{ fontSize: "1rem" }} className="fw-bold">
//                                             Last Modified By : {this.props?.ideaDetails?.initiated_name}
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>

//                         </div>
//                     </div>
//                     {/* ----------------------------------- */}
//                     <img
//                         src={IdeaPage3}
//                         alt="IdeaPage3"
//                         style={{
//                             width: '100%',
//                             padding: '0'
//                         }}
//                     />
//                 </div>
//             </div>
//         );
//     }
// }
// export default detailToDownload;
