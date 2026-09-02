import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import "./institute_profile.css";
import { useEffect, useState } from "react";
import {
    getInstituteData,
    SaveHeroImagesApi,
    SaveBrandingImagesApi,
    SaveQuickInfoApi,
    SaveAboutInfoApi,
    SaveAcademicProgramsApi,
    SaveFacilitiesApi,
    SaveGalleryApi,
    SaveFaqsApi,
    publishInstituteApi
} from "../../../../apicalls/admin_apicalls";

const createHeroImages = (savedImages = []) => {
    return [1, 2, 3, 4, 5].map((number) => {
        const savedImage = savedImages.find((image) => image.name === `image${number}`);
        return { name: `image${number}`, file: null, imageUrl: savedImage?.imageUrl || "" };
    });
};

export const InstituteProfile = () => {
    let [basicInfo, setBasicInfo] = useState({});
    let [heroImages, setHeroImages] = useState(createHeroImages());
    let [quickInfo, setQuickInfo] = useState({ admissionStatus: "", board: "", classes: "", medium: "", gender: "" });
    let [aboutInfo, setAboutInfo] = useState({ about: "", establishedYear: "", totalStudents: "", teachers: "", campusArea: "" });
    let [academicPrograms, setAcademicPrograms] = useState([]);
    let [facilities, setFacilities] = useState([]);
    let [gallery, setGallery] = useState([]);
    let [faqs, setFaqs] = useState([]);
    let [editField, setEditField] = useState(null);
    let [savingSection, setSavingSection] = useState("");
    let [brandingImages, setBrandingImages] = useState({ instituteLogo: { file: null, imageUrl: "" }, timeTableImage: { file: null, imageUrl: "" } });

    const loadInstituteData = () => {
        getInstituteData((data) => {
            setBasicInfo(data || {});
            setHeroImages(createHeroImages(data?.heroImages || []));
            setQuickInfo(data?.quickInfo || { admissionStatus: "", board: "", classes: "", medium: "", gender: "" });
            setAboutInfo(data?.aboutInfo || { about: "", establishedYear: "", totalStudents: "", teachers: "", campusArea: "" });
            setAcademicPrograms(data?.academicPrograms || []);
            setFacilities(data?.facilities || []);
            setGallery(data?.gallery || []);
            setFaqs(data?.faqs || []);
            setBrandingImages({
                instituteLogo: { file: null, imageUrl: data?.instituteLogo?.imageUrl || "" },
                timeTableImage: { file: null, imageUrl: data?.timeTableImage?.imageUrl || "" }
            });
        });
    };

    useEffect(() => {
        loadInstituteData();
    }, []);

    const saveSection = async (section, apiCall) => {
        setSavingSection(section);
        await apiCall();
        setSavingSection("");
        loadInstituteData();
    };

    // ==============================
    // HERO IMAGES
    // ==============================

    const handleHeroImgChange = (e) => {
        const { name, files } = e.target;
        setHeroImages((prev) =>
            prev.map((image) => image.name === name ? { ...image, file: files[0] } : image)
        );
    };

    const SaveHeroImages = () => {
        let formData = new FormData();
        heroImages.forEach((image) => {
            if (image.file) {
                formData.append(image.name.replace("image", "heroImages"), image.file);
            }
        });
        saveSection("hero", () => SaveHeroImagesApi(formData));
    };

    // ==============================
    // BRANDING IMAGES
    // ==============================

    const handleBrandingImgChange = (e) => {
        const { name, files } = e.target;
        setBrandingImages((prev) => ({
            ...prev,
            [name]: { ...prev[name], file: files[0] }
        }));
    };

    const SaveBrandingImages = () => {
        let formData = new FormData();
        if (brandingImages.instituteLogo.file) {
            formData.append("instituteLogo", brandingImages.instituteLogo.file);
        }
        if (brandingImages.timeTableImage.file) {
            formData.append("timeTableImage", brandingImages.timeTableImage.file);
        }
        if (!brandingImages.instituteLogo.file && !brandingImages.timeTableImage.file) {
            alert("Please select at least one image to upload.");
            return;
        }
        saveSection("branding", () => SaveBrandingImagesApi(formData));
    };

    // ==============================
    // QUICK INFO
    // ==============================

    const handleQuickInfoSecChange = (e) => setQuickInfo(
        (prev) => ({ ...prev, [e.target.name]: e.target.value })
    );

    const SaveQuickInfo = () => saveSection("quickInfo", () => SaveQuickInfoApi(quickInfo));

    // ==============================
    // ABOUT INFO
    // ==============================

    const handleAboutInfoSecChange = (e) => setAboutInfo(
        (prev) => ({ ...prev, [e.target.name]: e.target.value })
    );
    const SaveAboutInfo = () => saveSection("aboutInfo", () => SaveAboutInfoApi(aboutInfo));

    // ==============================
    // ACADEMIC PROGRAMS
    // ==============================

    const AddAcademicProgram = () => {
        setAcademicPrograms((prev) => [...prev, {
            id: Date.now(), class: "", duration: "", admissionFee: 0, monthlyFee: 0, admissionStatus: "OPEN"
        }]);
    };

    const removeAcademicProgram = (id) => setAcademicPrograms(
        (prev) => prev.filter((program) => program.id !== id)
    );

    const SaveAcademicPrograms = () => saveSection("programs", () => SaveAcademicProgramsApi(academicPrograms));

    // ==============================
    // FACILITIES
    // ==============================

    const handleFacilitiesSecChange = (e, id) => {
        const { name, value } = e.target;
        if (name === "name" && facilities.some(
            (facility) => facility.id !== id && facility.name.toLowerCase() === value.toLowerCase()
        )) {
            alert("Facility already exists");
            return;
        }
        setFacilities((prev) => prev.map(
            (facility) => facility.id === id ? { ...facility, [name]: value } : facility
        ));
    };

    const AddFacility = () => setFacilities(
        (prev) => [...prev, { id: crypto.randomUUID(), name: "", description: "" }]
    );

    const RemoveFacility = (id) => setFacilities(
        (prev) => prev.filter((facility) => facility.id !== id)
    );

    const SaveFacilities = () => saveSection("facilities", () => SaveFacilitiesApi(facilities));

    // ==============================
    // GALLERY
    // ==============================

    const handleGalleryImgChange = (e, id) => {
        const { files } = e.target;
        setGallery((prev) => prev.map(
            (image) => image.id === id ? { ...image, file: files[0] } : image
        ));
    };

    const AddGallery = () => {
        if (gallery.length >= 10) {
            alert("Maximum 10 gallery images are allowed.");
            return;
        }
        setGallery((prev) => [...prev, { id: crypto.randomUUID(), imageUrl: "", file: null }]);
    };

    const RemoveGallery = (id) => setGallery(
        (prev) => prev.filter((image) => image.id !== id)
    );

    const SaveGallery = () => {
        let formData = new FormData();
        const keptGalleryIds = gallery.filter(
            (image) => image.imageUrl && !image.file
        ).map((image) => image.id);
        formData.append("keptGalleryIds", JSON.stringify(keptGalleryIds));
        gallery.forEach((image) => {
            if (image.file) formData.append("galleryImages", image.file);
        });
        saveSection("gallery", () => SaveGalleryApi(formData));
    };

    // ==============================
    // FAQS
    // ==============================

    const handleFaqSecChange = (e, id) => {
        const { name, value } = e.target;
        setFaqs((prev) => prev.map(
            (faq) => faq.id === id ? { ...faq, [name]: value } : faq
        ));
    };

    const AddFaq = () => setFaqs(
        (prev) => [...prev, { id: crypto.randomUUID(), question: "", answer: "" }]
    );

    const RemoveFaq = (id) => setFaqs(
        (prev) => prev.filter((faq) => faq.id !== id)
    );

    const SaveFaqs = () => saveSection("faqs", () => SaveFaqsApi(faqs));

    return (
        <section className="instituteProfile">
            <div className="profileHeader">
                <div>
                    <span>Institute Settings</span>
                    <h1>Institute Profile</h1>
                    <p>Manage your institute information displayed to students.</p>
                </div>
                <button className="saveSectionBtn"
                    disabled={savingSection === "publish"}
                    onClick={() => saveSection("publish", publishInstituteApi)}>
                    {savingSection === "publish" ? "Publishing..." : basicInfo?.isPublished ? "Published" : "Publish Institute"}
                </button>
            </div>

            <section className="profileCard">
                <div className="profileCardHeader">
                    <h2>Website Hero Section</h2>
                    <button className="saveSectionBtn saveHeroBtn"
                        disabled={savingSection === "hero"}
                        onClick={SaveHeroImages}>
                        {savingSection === "hero" ? "Saving..." : "Save Images"}
                    </button>
                </div>
                <div className="webHeroSectionHandling">
                    {heroImages.map((image) =>
                        <div key={image.name}>
                            <label>{image.name}</label>
                            {image.imageUrl && <img src={image.imageUrl} alt={image.name} />}
                            <input type="file" accept="image/*" name={image.name} onChange={handleHeroImgChange} />
                        </div>
                    )}
                </div>
            </section>

            <section className="profileCard">
                <div className="profileCardHeader">
                    <div>
                        <h2>Branding &amp; Timetable Images</h2>
                        <p className="profileCardDesc">Upload the institute logo and class timetable image.</p>
                    </div>
                    <button className="saveSectionBtn saveBrandingBtn"
                        disabled={savingSection === "branding"}
                        onClick={SaveBrandingImages}>
                        {savingSection === "branding" ? "Saving..." : "Save Branding"}
                    </button>
                </div>
                <div className="brandingImagesGrid">
                    <div className="brandingImageItem">
                        <label className="brandingLabel">Institute Logo</label>
                        <p className="brandingHint">Displayed in circular form across the platform (landing page, receipts, sidebar).</p>
                        {brandingImages.instituteLogo.imageUrl
                            ? <div className="brandingPreviewCircle">
                                <img src={brandingImages.instituteLogo.imageUrl} alt="Institute Logo" className="brandingLogoPreview" />
                              </div>
                            : <div className="brandingPreviewCirclePlaceholder"><span>No Logo</span></div>
                        }
                        <input type="file" accept="image/*" name="instituteLogo" onChange={handleBrandingImgChange} />
                    </div>
                    <div className="brandingImageItem">
                        <label className="brandingLabel">Class Timetable</label>
                        <p className="brandingHint">Displayed on the institute landing page for students and parents.</p>
                        {brandingImages.timeTableImage.imageUrl
                            ? <img src={brandingImages.timeTableImage.imageUrl} alt="Timetable" className="brandingTimetablePreview" />
                            : <div className="brandingTimetablePlaceholder"><span>No Timetable Image</span></div>
                        }
                        <input type="file" accept="image/*" name="timeTableImage" onChange={handleBrandingImgChange} />
                    </div>
                </div>
            </section>

            <section className="profileCard">
                <h2>Basic Information</h2>
                <div className="profileGrid">
                    <div>
                        <label>Institute Name</label>
                        <input type="text" value={basicInfo?.instituteName || ""} placeholder="Institute Name" disabled />
                    </div>
                    <div>
                        <label>Address</label>
                        <input type="text" value={basicInfo?.instituteAddress || ""} placeholder="Address" disabled />
                    </div>
                    <div>
                        <label>Phone Number</label>
                        <input type="text" value={basicInfo?.institutePhone || ""} placeholder="Phone Number" disabled />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="text" value={basicInfo?.instituteEmail || ""} placeholder="Email" disabled />
                    </div>
                    <div>
                        <label>Type</label>
                        <input type="text" value={basicInfo?.instituteType || ""} placeholder="Type" disabled />
                    </div>
                </div>
            </section>

            <section className="profileCard">
                <div className="profileCardHeader">
                    <h2>Quick Information</h2>
                    <button className="saveSectionBtn saveQuickInfoBtn"
                        disabled={savingSection === "quickInfo"}
                        onClick={SaveQuickInfo}>
                        {savingSection === "quickInfo" ? "Saving..." : "Save Quick Info"}
                    </button>
                </div>
                <div className="profileGrid">
                    <div>
                        <label>Admission Status</label>
                        <select value={quickInfo.admissionStatus} name="admissionStatus" onChange={handleQuickInfoSecChange}>
                            <option value="">Admission Status</option>
                            <option value="OPEN">Open</option>
                            <option value="CLOSE">Close</option>
                        </select>
                    </div>
                    <div>
                        <label>Board</label>
                        <input type="text" value={quickInfo.board} name="board" onChange={handleQuickInfoSecChange} placeholder="Board" />
                    </div>
                    <div>
                        <label>Classes</label>
                        <input type="text" value={quickInfo.classes} name="classes" onChange={handleQuickInfoSecChange} placeholder="Play Group - 10th" />
                    </div>
                    <div>
                        <label>Medium</label>
                        <input type="text" value={quickInfo.medium} name="medium" onChange={handleQuickInfoSecChange} placeholder="Urdu/English" />
                    </div>
                    <div className="fullWidth">
                        <label>Gender</label>
                        <input type="text" value={quickInfo.gender} name="gender" onChange={handleQuickInfoSecChange} placeholder="Co-Edu/Female/Male" />
                    </div>
                </div>
            </section>

            <section className="profileCard">
                <div className="profileCardHeader">
                    <h2>About & Overview Section</h2>
                    <button className="saveSectionBtn saveAboutInfoBtn" disabled={savingSection === "aboutInfo"} onClick={SaveAboutInfo}>{savingSection === "aboutInfo" ? "Saving..." : "Save About Info"}</button>
                </div>
                <div className="profileGrid">
                    <div className="fullWidth">
                        <label>About</label>
                        <textarea rows="6" value={aboutInfo.about} name="about" onChange={handleAboutInfoSecChange} placeholder="Write about your institute..."></textarea>
                    </div>
                    <div>
                        <label>Established Year</label>
                        <input type="text" value={aboutInfo.establishedYear} name="establishedYear" onChange={handleAboutInfoSecChange} placeholder="2006" />
                    </div>
                    <div>
                        <label>Total Students</label>
                        <input type="text" value={aboutInfo.totalStudents} name="totalStudents" onChange={handleAboutInfoSecChange} placeholder="1,250+" />
                    </div>
                    <div>
                        <label>Teachers</label>
                        <input type="text" value={aboutInfo.teachers} name="teachers" onChange={handleAboutInfoSecChange} placeholder="85+" />
                    </div>
                    <div><label>Campus Area</label><input type="text" value={aboutInfo.campusArea} name="campusArea" onChange={handleAboutInfoSecChange} placeholder="8 Acres" /></div>
                </div>
            </section>

            <section className="profileCard">
                <div className="profileCardHeader">
                    <h2>Academic Programs (Classes & Fee Structure)</h2>
                    <button className="saveSectionBtn saveAcademicProgramsBtn"
                        disabled={savingSection === "programs"}
                        onClick={SaveAcademicPrograms}>
                        {savingSection === "programs" ? "Saving..." : "Save Academic Programs"}
                    </button>
                </div>
                <div className="tableResponsiveWrapper">
                    <table className="adm_academic_program_table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Duration</th>
                                <th>Admission Fee</th>
                                <th>Monthly Fee</th>
                                <th>Admission Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {academicPrograms.map((program) => <tr key={program.id}>
                                <td>{program.class}</td>
                                <td>{program.duration}</td>
                                <td>Rs. {program.admissionFee}</td>
                                <td>Rs. {program.monthlyFee}</td>
                                <td>{program.admissionStatus}</td>
                                <td>
                                    <div className="actions">
                                        <button className="editBtn" onClick={() => setEditField({ ...program })}><FaEdit /></button>
                                        <button className="deleteBtn" onClick={() => removeAcademicProgram(program.id)}><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                {editField && <div className="editAcademicProgramOverlay">
                    <div className="editAcademicProgram">
                        <div className="editAcademicProgramHeader">
                            <div>
                                <span className="editProgramEyebrow">
                                    Academic Program
                                </span>
                                <h3>Edit Program</h3>
                                <p>Update the class, fees and admission details.</p>
                            </div>
                            <button type="button" className="editProgramCloseBtn"
                                onClick={() => setEditField(null)}>
                                ×
                            </button>
                        </div>
                        <div className="editAcademicProgramBody">
                            <div className="editProgramField">
                                <label>Class</label>
                                <input type="text" placeholder="No spaces or special characters. e.g: Play-Group is invalid." value={editField.class} onChange={(e) => setEditField((prev) => ({ ...prev, class: e.target.value }))} />
                            </div>
                            <div className="editProgramField">
                                <label>Duration</label>
                                <input type="text" value={editField.duration} onChange={(e) => setEditField((prev) => ({ ...prev, duration: e.target.value }))} />
                            </div>
                            <div className="editProgramField">
                                <label>Admission Fee</label>
                                <div className="feeInput">
                                    <span>Rs.</span>
                                    <input type="number" min="0" value={editField.admissionFee} onChange={(e) => setEditField((prev) => ({ ...prev, admissionFee: e.target.value }))} />
                                </div>
                            </div>
                            <div className="editProgramField">
                                <label>Monthly Fee</label>
                                <div className="feeInput">
                                    <span>Rs.</span>
                                    <input type="number" min="0"
                                        value={editField.monthlyFee}
                                        onChange={(e) => setEditField((prev) => ({ ...prev, monthlyFee: e.target.value }))} />
                                </div>
                            </div>
                            <div className="editProgramField fullWidth">
                                <label>Admission Status</label>
                                <select value={editField.admissionStatus} onChange={(e) => setEditField((prev) => ({ ...prev, admissionStatus: e.target.value }))}>
                                    <option value="OPEN">Open</option>
                                    <option value="CLOSE">Closed</option>
                                </select>
                            </div>
                        </div>
                        <div className="adm_academic_program_table_editActions">
                            <button type="button" className="cancelBtn" onClick={() => setEditField(null)}>Cancel</button>
                            <button type="button" className="saveBtn" onClick={() => {
                                setAcademicPrograms((prev) => prev.map((program) => program.id === editField.id ? editField : program));
                                setEditField(null);
                            }}>Save Changes</button>
                        </div>
                    </div>
                </div>}
                <button className="addMoreBtn" onClick={AddAcademicProgram}><FaPlus /></button>
            </section>

            <section className="profileCard">
                <div className="profileCardHeader">
                    <h2>Campus Facilities</h2>
                    <button className="saveSectionBtn saveFacilitiesBtn" disabled={savingSection === "facilities"} onClick={SaveFacilities}>
                        {savingSection === "facilities" ? "Saving..." : "Save Facilities"}
                    </button>
                </div>
                <div className="profileGrid">
                    {facilities.map((facility, index) => (
                        <div className="fullWidth" key={facility.id}>
                            <span className="facilityCount">{index + 1}</span>
                            <label>Name</label>
                            <input type="text" name="name" value={facility.name} onChange={(e) => handleFacilitiesSecChange(e, facility.id)} />
                            <label>Description</label>
                            <textarea rows="4" name="description" value={facility.description} onChange={(e) => handleFacilitiesSecChange(e, facility.id)}></textarea>
                            <button className="removeBtn" onClick={() => RemoveFacility(facility.id)}><FaTrash /></button>
                        </div>
                    ))}
                </div>
                <button className="addMoreBtn" onClick={AddFacility}><FaPlus /></button>
            </section>

            <section className="profileCard">
                <div className="profileCardHeader">
                    <h2>Campus Gallery Section</h2>
                    <button className="saveSectionBtn saveGalleryBtn" disabled={savingSection === "gallery"} onClick={SaveGallery}>
                        {savingSection === "gallery" ? "Saving..." : "Save Gallery"}
                    </button>
                </div>
                <div className="webHeroSectionHandling">
                    {gallery.map((image, index) => (
                        <div key={image.id}>
                            <label>Image {index + 1}</label>
                            {image.imageUrl && <img src={image.imageUrl} alt={`Gallery image ${index + 1}`} />}
                            <input type="file" accept="image/*" onChange={(e) => handleGalleryImgChange(e, image.id)} />
                            <button className="removeBtn" onClick={() => RemoveGallery(image.id)}><FaTrash /></button>
                        </div>
                    ))}
                </div>
                <button className="addMoreBtn" onClick={AddGallery}><FaPlus /></button>
            </section>

            <section className="profileCard">
                <div className="profileCardHeader">
                    <h2>FAQs Section</h2>
                    <button className="saveSectionBtn saveFaqsBtn" disabled={savingSection === "faqs"} onClick={SaveFaqs}>
                        {savingSection === "faqs" ? "Saving..." : "Save FAQs"}
                    </button>
                </div>
                <div className="profileGrid">
                    {faqs.map((faq, index) => (
                        <div className="fullWidth" key={faq.id}>
                            <span className="facilityCount">{index + 1}</span>
                            <label>Question</label>
                            <input type="text" name="question" value={faq.question} onChange={(e) => handleFaqSecChange(e, faq.id)} />
                            <label>Answer</label>
                            <textarea rows="4" name="answer" value={faq.answer} onChange={(e) => handleFaqSecChange(e, faq.id)}></textarea>
                            <button className="removeBtn" onClick={() => RemoveFaq(faq.id)}><FaTrash /></button>
                        </div>
                    ))}
                </div>
                <button className="addMoreBtn" onClick={AddFaq}><FaPlus /></button>
            </section>
        </section>
    );
};
