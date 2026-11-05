import {
    FaBuilding,
    FaCheckCircle,
    FaEdit,
    FaEnvelope,
    FaGlobe,
    FaGraduationCap,
    FaImage,
    FaImages,
    FaInfoCircle,
    FaLayerGroup,
    FaMapMarkerAlt,
    FaPhone,
    FaPlus,
    FaQuestionCircle,
    FaSchool,
    FaTrash,
    FaUniversity,
    FaUpload
} from "react-icons/fa";
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
import { useToast } from "../../../../components/toast/ToastContext";

const createHeroImages = (savedImages = []) => {
    return [1, 2, 3, 4, 5].map((number) => {
        const savedImage = savedImages.find((image) => image.name === `image${number}`);
        return { name: `image${number}`, file: null, imageUrl: savedImage?.imageUrl || "" };
    });
};

const SectionHeader = ({ icon, title, description, children }) => (
    <div className="profileCardHeader">
        <div className="sectionHeading">
            <span className="sectionIcon">
                {icon}
            </span>
            <div>
                <h2>{title}</h2>
                {description && (
                    <p className="profileCardDesc">{description}</p>
                )}
            </div>
        </div>
        {children}
    </div>
);

const EmptyState = ({ icon, title, description }) => (
    <div className="profileEmptyState">
        <span className="profileEmptyIcon">
            {icon}
        </span>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

export const InstituteProfile = () => {
    const toast = useToast();
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
            toast.error("Please select at least one image to upload.");
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
            toast.error("A facility with this name already exists.");
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
            toast.error("Maximum 10 gallery images are allowed.");
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
                <div className="profileHeaderMain">
                    <span className="profileHeaderEyebrow">
                        <FaSchool />
                        Institute Settings
                    </span>
                    <h1>{basicInfo?.instituteName || "Institute Profile"}</h1>
                    <p>
                        Manage the information students see on your public institute
                        page, from branding and facilities to fees and FAQs.
                    </p>
                    <div className="profileHeaderMeta">
                        <span className={basicInfo?.isPublished ? "publishBadge published" : "publishBadge draft"}>
                            {basicInfo?.isPublished ? <FaCheckCircle /> : <FaInfoCircle />}
                            {basicInfo?.isPublished ? "Published and visible to students" : "Draft — not visible to students"}
                        </span>
                        {basicInfo?.instituteType && (
                            <span className="headerMetaItem">
                                <FaUniversity />
                                {basicInfo.instituteType}
                            </span>
                        )}
                        {basicInfo?.instituteAddress && (
                            <span className="headerMetaItem">
                                <FaMapMarkerAlt />
                                {basicInfo.instituteAddress}
                            </span>
                        )}
                    </div>
                </div>
                <button className="saveSectionBtn publishInstituteBtn"
                    disabled={savingSection === "publish" || basicInfo?.isPublished}
                    onClick={() => saveSection("publish", publishInstituteApi)}>
                    {savingSection === "publish"
                        ? "Publishing..."
                        : basicInfo?.isPublished
                            ? <><FaCheckCircle /> Published</>
                            : <><FaGlobe /> Publish Institute</>
                    }
                </button>
            </div>

            <section className="profileCard">
                <SectionHeader
                    icon={<FaImages />}
                    title="Website Hero Section"
                    description="Upload up to five images for the top of your public institute page."
                >
                    <button className="saveSectionBtn saveHeroBtn"
                        disabled={savingSection === "hero"}
                        onClick={SaveHeroImages}>
                        {savingSection === "hero" ? "Saving..." : "Save Images"}
                    </button>
                </SectionHeader>
                <div className="heroImagesGrid">
                    {heroImages.map((image, index) => (
                        <div className="heroImageCard" key={image.name}>
                            <div className="heroImagePreview">
                                {image.imageUrl
                                    ? <img src={image.imageUrl} alt={`Hero ${index + 1}`} />
                                    : <div className="imagePlaceholder">
                                        <FaImage />
                                        <span>No image yet</span>
                                    </div>
                                }
                                <span className="imageIndexBadge">Image {index + 1}</span>
                            </div>
                            <label className="fileUploadLabel">
                                <FaUpload />
                                <span>{image.file ? image.file.name : "Choose image"}</span>
                                <input type="file" accept="image/*" name={image.name} onChange={handleHeroImgChange} />
                            </label>
                        </div>
                    ))}
                </div>
            </section>

            <section className="profileCard">
                <SectionHeader
                    icon={<FaImage />}
                    title="Branding & Timetable Images"
                    description="Upload the institute logo and class timetable image."
                >
                    <button className="saveSectionBtn saveBrandingBtn"
                        disabled={savingSection === "branding"}
                        onClick={SaveBrandingImages}>
                        {savingSection === "branding" ? "Saving..." : "Save Branding"}
                    </button>
                </SectionHeader>
                <div className="brandingImagesGrid">
                    <div className="brandingImageItem">
                        <div className="brandingItemHeader">
                            <label className="brandingLabel">Institute Logo</label>
                            <span className="brandingTag">Square</span>
                        </div>
                        <p className="brandingHint">Displayed in circular form across the platform (landing page, receipts, sidebar).</p>
                        {brandingImages.instituteLogo.imageUrl
                            ? <div className="brandingPreviewCircle">
                                <img src={brandingImages.instituteLogo.imageUrl} alt="Institute Logo" className="brandingLogoPreview" />
                              </div>
                            : <div className="brandingPreviewCirclePlaceholder"><span>No Logo</span></div>
                        }
                        <label className="fileUploadLabel">
                            <FaUpload />
                            <span>{brandingImages.instituteLogo.file ? brandingImages.instituteLogo.file.name : "Choose logo"}</span>
                            <input type="file" accept="image/*" name="instituteLogo" onChange={handleBrandingImgChange} />
                        </label>
                    </div>
                    <div className="brandingImageItem">
                        <div className="brandingItemHeader">
                            <label className="brandingLabel">Class Timetable</label>
                            <span className="brandingTag">Wide image</span>
                        </div>
                        <p className="brandingHint">Displayed on the institute landing page for students and parents.</p>
                        {brandingImages.timeTableImage.imageUrl
                            ? <img src={brandingImages.timeTableImage.imageUrl} alt="Timetable" className="brandingTimetablePreview" />
                            : <div className="brandingTimetablePlaceholder"><span>No Timetable Image</span></div>
                        }
                        <label className="fileUploadLabel">
                            <FaUpload />
                            <span>{brandingImages.timeTableImage.file ? brandingImages.timeTableImage.file.name : "Choose timetable image"}</span>
                            <input type="file" accept="image/*" name="timeTableImage" onChange={handleBrandingImgChange} />
                        </label>
                    </div>
                </div>
            </section>

            <section className="profileCard">
                <SectionHeader
                    icon={<FaInfoCircle />}
                    title="Basic Information"
                    description="Official details from your verified institute registration."
                />
                <div className="basicInfoGrid">
                    <div className="basicInfoItem">
                        <span className="basicInfoIcon"><FaSchool /></span>
                        <div>
                            <small>Institute Name</small>
                            <strong>{basicInfo?.instituteName || "Not provided"}</strong>
                        </div>
                    </div>
                    <div className="basicInfoItem">
                        <span className="basicInfoIcon"><FaMapMarkerAlt /></span>
                        <div>
                            <small>Address</small>
                            <strong>{basicInfo?.instituteAddress || "Not provided"}</strong>
                        </div>
                    </div>
                    <div className="basicInfoItem">
                        <span className="basicInfoIcon"><FaPhone /></span>
                        <div>
                            <small>Phone Number</small>
                            <strong>{basicInfo?.institutePhone || "Not provided"}</strong>
                        </div>
                    </div>
                    <div className="basicInfoItem">
                        <span className="basicInfoIcon"><FaEnvelope /></span>
                        <div>
                            <small>Email</small>
                            <strong>{basicInfo?.instituteEmail || "Not provided"}</strong>
                        </div>
                    </div>
                    <div className="basicInfoItem">
                        <span className="basicInfoIcon"><FaUniversity /></span>
                        <div>
                            <small>Institute Type</small>
                            <strong>{basicInfo?.instituteType || "Not provided"}</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="profileCard">
                <SectionHeader
                    icon={<FaLayerGroup />}
                    title="Quick Information"
                    description="At-a-glance details shown near the top of your public profile."
                >
                    <button className="saveSectionBtn saveQuickInfoBtn"
                        disabled={savingSection === "quickInfo"}
                        onClick={SaveQuickInfo}>
                        {savingSection === "quickInfo" ? "Saving..." : "Save Quick Info"}
                    </button>
                </SectionHeader>
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
                <SectionHeader
                    icon={<FaUniversity />}
                    title="About & Overview Section"
                    description="Tell students and parents what makes your institute unique."
                >
                    <button className="saveSectionBtn saveAboutInfoBtn" disabled={savingSection === "aboutInfo"} onClick={SaveAboutInfo}>{savingSection === "aboutInfo" ? "Saving..." : "Save About Info"}</button>
                </SectionHeader>
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
                <SectionHeader
                    icon={<FaGraduationCap />}
                    title="Academic Programs"
                    description="Classes, duration and fee structure shown on your public profile."
                >
                    <div className="profileCardActions">
                        <button type="button" className="ghostActionBtn" onClick={AddAcademicProgram}>
                            <FaPlus />
                            Add Program
                        </button>
                        <button className="saveSectionBtn saveAcademicProgramsBtn"
                            disabled={savingSection === "programs"}
                            onClick={SaveAcademicPrograms}>
                            {savingSection === "programs" ? "Saving..." : "Save Programs"}
                        </button>
                    </div>
                </SectionHeader>
                {academicPrograms.length === 0 ? (
                    <EmptyState
                        icon={<FaGraduationCap />}
                        title="No academic programs yet"
                        description="Add your first class to show its duration, admission fee, monthly fee and admission status."
                    />
                ) : (
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
                                    <td>{program.class || "—"}</td>
                                    <td>{program.duration || "—"}</td>
                                    <td>Rs. {program.admissionFee}</td>
                                    <td>Rs. {program.monthlyFee}</td>
                                    <td>
                                        <span className={program.admissionStatus === "OPEN" ? "statusPill open" : "statusPill closed"}>
                                            {program.admissionStatus === "OPEN" ? "Open" : "Closed"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button className="editBtn" title="Edit program" aria-label={`Edit ${program.class || "program"}`} onClick={() => setEditField({ ...program })}><FaEdit /></button>
                                            <button className="deleteBtn" title="Delete program" aria-label={`Delete ${program.class || "program"}`} onClick={() => removeAcademicProgram(program.id)}><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                )}
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
            </section>

            <section className="profileCard">
                <SectionHeader
                    icon={<FaBuilding />}
                    title="Campus Facilities"
                    description="Highlight the facilities that make your campus a great place to learn."
                >
                    <div className="profileCardActions">
                        <button type="button" className="ghostActionBtn" onClick={AddFacility}>
                            <FaPlus />
                            Add Facility
                        </button>
                        <button className="saveSectionBtn saveFacilitiesBtn" disabled={savingSection === "facilities"} onClick={SaveFacilities}>
                            {savingSection === "facilities" ? "Saving..." : "Save Facilities"}
                        </button>
                    </div>
                </SectionHeader>
                {facilities.length === 0 ? (
                    <EmptyState
                        icon={<FaBuilding />}
                        title="No facilities added yet"
                        description="Add facilities such as a library, science lab, sports ground or transport service."
                    />
                ) : (
                    <div className="dynamicList">
                        {facilities.map((facility, index) => (
                            <div className="dynamicItem" key={facility.id}>
                                <div className="dynamicItemHeader">
                                    <span className="itemIndex">{index + 1}</span>
                                    <div>
                                        <strong>Facility {index + 1}</strong>
                                        <small>Shown in the campus facilities section</small>
                                    </div>
                                    <button type="button" className="iconDangerBtn" title="Remove facility" aria-label={`Remove facility ${index + 1}`} onClick={() => RemoveFacility(facility.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                                <div className="dynamicItemGrid">
                                    <div>
                                        <label>Name</label>
                                        <input type="text" name="name" value={facility.name} onChange={(e) => handleFacilitiesSecChange(e, facility.id)} placeholder="e.g. Science Laboratory" />
                                    </div>
                                    <div className="fullWidth">
                                        <label>Description</label>
                                        <textarea rows="3" name="description" value={facility.description} onChange={(e) => handleFacilitiesSecChange(e, facility.id)} placeholder="Describe this facility..."></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="profileCard">
                <SectionHeader
                    icon={<FaImages />}
                    title="Campus Gallery"
                    description="Showcase campus life with up to ten photos."
                >
                    <div className="profileCardActions">
                        <button type="button" className="ghostActionBtn" onClick={AddGallery}>
                            <FaPlus />
                            Add Image
                        </button>
                        <button className="saveSectionBtn saveGalleryBtn" disabled={savingSection === "gallery"} onClick={SaveGallery}>
                            {savingSection === "gallery" ? "Saving..." : "Save Gallery"}
                        </button>
                    </div>
                </SectionHeader>
                {gallery.length === 0 ? (
                    <EmptyState
                        icon={<FaImages />}
                        title="No gallery images yet"
                        description="Add photos of your campus, classrooms, events and facilities."
                    />
                ) : (
                    <div className="galleryGrid">
                        {gallery.map((image, index) => (
                            <div className="galleryCard" key={image.id}>
                                <div className="galleryPreview">
                                    {image.imageUrl
                                        ? <img src={image.imageUrl} alt={`Gallery image ${index + 1}`} />
                                        : <div className="imagePlaceholder">
                                            <FaImage />
                                            <span>No image yet</span>
                                        </div>
                                    }
                                    <span className="imageIndexBadge">{index + 1}</span>
                                    <button type="button" className="galleryRemoveBtn" title="Remove image" aria-label={`Remove gallery image ${index + 1}`} onClick={() => RemoveGallery(image.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                                <label className="fileUploadLabel">
                                    <FaUpload />
                                    <span>{image.file ? image.file.name : "Choose image"}</span>
                                    <input type="file" accept="image/*" onChange={(e) => handleGalleryImgChange(e, image.id)} />
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="profileCard">
                <SectionHeader
                    icon={<FaQuestionCircle />}
                    title="Frequently Asked Questions"
                    description="Answer common questions from prospective students and parents."
                >
                    <div className="profileCardActions">
                        <button type="button" className="ghostActionBtn" onClick={AddFaq}>
                            <FaPlus />
                            Add FAQ
                        </button>
                        <button className="saveSectionBtn saveFaqsBtn" disabled={savingSection === "faqs"} onClick={SaveFaqs}>
                            {savingSection === "faqs" ? "Saving..." : "Save FAQs"}
                        </button>
                    </div>
                </SectionHeader>
                {faqs.length === 0 ? (
                    <EmptyState
                        icon={<FaQuestionCircle />}
                        title="No FAQs added yet"
                        description="Add questions about admissions, fees, timings or transport."
                    />
                ) : (
                    <div className="dynamicList">
                        {faqs.map((faq, index) => (
                            <div className="dynamicItem" key={faq.id}>
                                <div className="dynamicItemHeader">
                                    <span className="itemIndex">{index + 1}</span>
                                    <div>
                                        <strong>Question {index + 1}</strong>
                                        <small>Displayed in the public FAQs section</small>
                                    </div>
                                    <button type="button" className="iconDangerBtn" title="Remove FAQ" aria-label={`Remove FAQ ${index + 1}`} onClick={() => RemoveFaq(faq.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                                <div className="dynamicItemGrid singleColumn">
                                    <div>
                                        <label>Question</label>
                                        <input type="text" name="question" value={faq.question} onChange={(e) => handleFaqSecChange(e, faq.id)} placeholder="e.g. What are the admission requirements?" />
                                    </div>
                                    <div>
                                        <label>Answer</label>
                                        <textarea rows="3" name="answer" value={faq.answer} onChange={(e) => handleFaqSecChange(e, faq.id)} placeholder="Write a clear answer..."></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
};
