/* eslint-disable indent */
import React from "react";
import "./Grid.css"; 
import pdfIcon from "../../assets/img/pdfn3.png";
import wordIcon from "../../assets/img/docume.jpg";

import { FaYoutube } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileWord } from "react-icons/fa";
const FileGrid = ({ resList }) => {
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
  
      const validHosts = ["youtube.com", "youtu.be", "s3.ap-south-1.amazonaws.com"];
  
      return validHosts.some((host) => url.hostname.includes(host));
    } catch (_) {
      return false;
    }
  };
  const getFilePreview = (url) => {
    if (!url || typeof url !== "string") return "https://upload.wikimedia.org/wikipedia/commons/8/89/File_icon.svg"; // Default icon
    
    if (url.endsWith(".pdf")) {
      return pdfIcon; 
    } else if (url.endsWith(".docx") || url.endsWith(".doc")) {
      return wordIcon; 
    } else if (url.match(/\.(jpeg|jpg|png|gif)$/)) {
      return url; 
    } else {
      return "https://upload.wikimedia.org/wikipedia/commons/8/89/File_icon.svg"; 
    }
  };
  
  const getFileTypeIcon = (url) => {
    if (!url || typeof url !== "string") {
      // return <FiFile size={20} />;
    }
  
    if (url.endsWith(".pdf")) {
      return <FaFilePdf size={20} color="red" />;
    } else if (url.endsWith(".docx") || url.endsWith(".doc")) {
      return <FaFileWord size={20} color="blue" />;
    } else if (url.match(/\.(jpeg|jpg|png|gif)$/)) {
      return <FaImage size={20} color="orange" />;
    } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return <FaYoutube  size={20} color="red" />;
    } 
  };
  
  
  
  const getYouTubeVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);
  
      if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v");
      } else if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.substring(1); 
      }
    } catch (error) {
      return null;
    }
  };

  return (
 
    <div className="row g-3" style={{ rowGap: "20px" }}>
  {resList.map((record, index) => (
    <div key={index} className="col-xl-2 col-lg-2 col-md-6 mb-3">
      <div
        className="card shadow-sm p-3 text-center"
        style={{ height: "220px", width: "190px" }}
      >
        <h6 className="mb-2" style={{ textAlign: "left" }}>
         
             {getFileTypeIcon(record.attachments)}&nbsp;
          <span style={{ marginLeft: "8px" }}>
            {record.description.length > 10
              ? record.description.slice(0, 10) + "..."
              : record.description}
          </span>
        
        </h6>

        {record.type === "file" ? (
          <div>
          

    <a href={record.attachments} target="_blank" rel="noopener noreferrer">
      <img
        src={getFilePreview(record.attachments)}
        alt="File Preview"
        className="card-img-top mb-1"
        style={{ maxHeight: "120px", objectFit: "cover" }}
      />
    </a>
    <div className="d-grid">
            <a
              href={record.attachments}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-primary mt-2 mb-1"
            >
              <i className="fas fa-external-link-alt"></i> Open File
            </a>
          </div>
          </div>

        ) : (
          <div>
            {isValidUrl(record.attachments) 
            
             ? (
              <>
                <a href={record.attachments} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(record.attachments)}/hqdefault.jpg`}
                    alt="YouTube Thumbnail"
                    className="img-fluid mb-1"
                    style={{ maxHeight: "160px", objectFit: "cover" }}
                  />
                </a>
                <div className="d-grid">
                <a
                  href={record.attachments}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary mt-1"
                >
                  <i className="fas fa-external-link-alt"></i> Watch Video
                </a>
                </div>
              </>
            ) : (
              <p>Invalid video URL</p>
            )}
          </div>
        )}
      </div>
    </div>
  ))}
</div>


  );
};

export default FileGrid;


