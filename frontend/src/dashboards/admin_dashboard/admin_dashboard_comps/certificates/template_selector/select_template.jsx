import {
    FaCheck,
    FaPalette,
    FaLayerGroup,
    FaShapes
} from "react-icons/fa";
import "./select_template.css";

export const SelectTemplate = ({
    certificateType,
    setSelectedCertificate,
    onCancel
}) => {
    const templates = [
        {
            id: "CLASSIC",
            name: "Classic",
            description: "A traditional and formal certificate design.",
            icon: <FaLayerGroup />
        },
        {
            id: "MODERN",
            name: "Modern",
            description: "A clean and contemporary certificate design.",
            icon: <FaPalette />
        },
        {
            id: "INLINE",
            name: "Inline",
            description: "A simple and compact certificate design.",
            icon: <FaShapes />
        }
    ];

    return (
        <div className="certificateTemplateOverlay">

            <div className="certificateTemplateModal">

                <div className="certificateTemplateHeader">
                    <div>
                        <span>
                            CERTIFICATE DESIGN
                        </span>

                        <h2>
                            Select Template
                        </h2>

                        <p>
                            Choose a template for the{" "}
                            <strong>
                                {certificateType || "certificate"}
                            </strong>.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="certificateTemplateClose"
                        onClick={onCancel}
                    >
                        ×
                    </button>
                </div>


                <div className="certificateTemplateGrid">

                    {templates.map((template) => (
                        <button
                            type="button"
                            key={template.id}
                            className="certificateTemplateCard"
                            onClick={() => setSelectedCertificate((prev) => ({
                                ...prev,
                                template: template.id
                            }))}
                        >

                            <div className="certificateTemplatePreview">

                                <div className="templatePreviewTop">
                                    {template.icon}
                                </div>

                                <div className="templatePreviewLines">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                                <div className="templatePreviewBottom">
                                    <span></span>
                                    <span></span>
                                </div>

                            </div>


                            <div className="certificateTemplateInfo">

                                <h3>
                                    {template.name}
                                </h3>

                                <p>
                                    {template.description}
                                </p>

                            </div>


                            <div className="certificateTemplateSelectBtn">

                                <FaCheck />

                                Select Template

                            </div>

                        </button>
                    ))}

                </div>


                <div className="certificateTemplateFooter">

                    <button
                        type="button"
                        className="certificateTemplateCancelBtn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>
    );
};