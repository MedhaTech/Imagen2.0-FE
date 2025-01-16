/* eslint-disable indent */
import React from 'react';
import "../../../IdeaList/image.css";

const LinkComponent = ({ item }) => {
    return (
        // <>
        //     {item &&
        //         item.length > 0 &&
        //         item.map((ans, i) => {
        //             let a_link = ans.split('/');
        //             let count = a_link.length - 1;
        //             return (
        //                 <a
        //                     key={i}
        //                     className="badge mb-2 bg-success p-3 ms-3"
        //                     href={ans}
        //                     target="_blank"
        //                     rel="noreferrer"
        //                 >
        //                     {a_link[count]}
        //                 </a>
        //             );
        //         })}
        // </>
        <>
        {item &&
            item.length > 0 &&
            item.map((ans, i) => {
                let a_link = ans.split('/');
                let count = a_link.length - 1;
                let fileName = a_link[count];
                return (
                    <a
                        key={i}
                        className="badge link-badge mb-2 bg-info p-3 ms-3"
                        href={ans}
                        target="_blank"
                        rel="noreferrer"
                    >
                        
                      
                         <span className="file-name">
                            {fileName}
                        </span>
                       

                    </a>
                );
            })}
    </>
    );
};

export default LinkComponent;
