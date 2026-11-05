import { useEffect, useState } from "react";
import {
    FaBookOpen,
    FaPlus,
    FaTrash,
    FaArrowRight,
    FaImage,
    FaCertificate,
    FaPen,
    FaSyncAlt,
    FaTimes
} from "react-icons/fa";
import "./course_form.css";
import {
    createCourse,
    getAllCoursesForManagement,
    updateCourse
} from "../../../../apicalls/superadmin_apicalls";
import { Enrollments } from "./enrollments/enrollments";
import { EnrollmentPaymentView } from "./enrollment_payment_comp/enrollment_payment";
import { CourseCertificate } from "./certificates/course_certificate";

const createEmptyCourse = () => ({
    title: "",
    courseCode: "",
    category: "",
    shortDescription: "",
    description: "",
    level: "BEGINNER",
    mode: "ONLINE",
    duration: "",
    offeredByInstitute: "",
    offeredByInstituteLogoUrl: "",
    thumbnail: "",
    learningOutcomes: [""],
    requirements: [""],
    targetAudience: [""],
    modules: [],
    certificateAvailable: true,
    enrollmentOpen: true,
    enrollmentStart: "",
    enrollmentEnd: "",
    maxStudents: "",
    price: "",
    language: "",
    whatsappGroupLink: "",
    status: "PUBLISHED",
});

const toDateInputValue = (value) => {
    if (!value) return "";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? ""
        : date.toISOString().slice(0, 10);
};

const toTextList = (value) => (
    Array.isArray(value) && value.length > 0 ? value : [""]
);

const toCourseForm = (item) => ({
    ...createEmptyCourse(),
    ...item,
    price: item.price ?? "",
    maxStudents: item.maxStudents ?? "",
    language: item.language || "",
    whatsappGroupLink: item.whatsappGroupLink || "",
    thumbnail: item.thumbnail || "",
    offeredByInstituteLogoUrl: item.offeredByInstituteLogoUrl || "",
    enrollmentStart: toDateInputValue(item.enrollmentStart),
    enrollmentEnd: toDateInputValue(item.enrollmentEnd),
    status: item.status || "DRAFT",
    learningOutcomes: toTextList(item.learningOutcomes),
    requirements: toTextList(item.requirements),
    targetAudience: toTextList(item.targetAudience),
    modules: Array.isArray(item.modules)
        ? item.modules.map((module) => ({
            ...module,
            description: module.description || "",
            lessons: Array.isArray(module.lessons) ? module.lessons : [],
        }))
        : [],
});

export const ManageCourses = () => {
    const [currentComponent, setCurrentComponent] = useState("courses");
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [course, setCourse] = useState(createEmptyCourse);

    useEffect(() => {
        getAllCoursesForManagement(setCourses, setListLoading);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setCourse((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleArrayChange = (field, index, value) => {
        setCourse((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) =>
                i === index ? value : item
            )
        }));
    };

    const addArrayItem = (field) => {
        setCourse((prev) => ({
            ...prev,
            [field]: [...prev[field], ""]
        }));
    };

    const removeArrayItem = (field, index) => {
        setCourse((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const addModule = () => {
        setCourse((prev) => ({
            ...prev,
            modules: [
                ...prev.modules,
                {
                    title: "",
                    description: "",
                    lessons: [""]
                }
            ]
        }));
    };

    const updateModule = (moduleIndex, field, value) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.map((module, index) =>
                index === moduleIndex
                    ? { ...module, [field]: value }
                    : module
            )
        }));
    };

    const removeModule = (moduleIndex) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.filter(
                (_, index) => index !== moduleIndex
            )
        }));
    };

    const addLesson = (moduleIndex) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.map((module, index) =>
                index === moduleIndex
                    ? {
                        ...module,
                        lessons: [...module.lessons, ""]
                    }
                    : module
            )
        }));
    };

    const updateLesson = (
        moduleIndex,
        lessonIndex,
        value
    ) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.map((module, index) =>
                index === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.map(
                            (lesson, i) =>
                                i === lessonIndex
                                    ? value
                                    : lesson
                        )
                    }
                    : module
            )
        }));
    };

    const removeLesson = (
        moduleIndex,
        lessonIndex
    ) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.map((module, index) =>
                index === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.filter(
                            (_, i) => i !== lessonIndex
                        )
                    }
                    : module
            )
        }));
    };

    const resetForm = () => {
        setEditingId(null);
        setCourse(createEmptyCourse());
    };

    const startEditing = (item) => {
        setEditingId(item._id);
        setCourse(toCourseForm(item));
        document.querySelector(".courseCreateForm")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const refreshCourses = () => {
        getAllCoursesForManagement(setCourses, setListLoading);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const wasEditing = Boolean(editingId);
        const result = wasEditing
            ? await updateCourse(editingId, course, setLoading)
            : await createCourse(course, setLoading);

        if (result?.success) {
            resetForm();
            refreshCourses();
        }
    };

    if (currentComponent === "enrollment") {
        return (
            <div className="superAdminCoursePage">
                <Enrollments
                    setCurrentComponent={setCurrentComponent}
                />
            </div>
        );
    }

    if (currentComponent.startsWith("createCertificate:")) {
        const id = currentComponent.split(":")[1];

        return (
            <div className="superAdminCoursePage">
                <CourseCertificate
                    id={id}
                    onBack={() => setCurrentComponent("enrollment")}
                />
            </div>
        )
    }

    if (currentComponent.startsWith("enrollment_payment:")) {
        const id = currentComponent.split(":")[1];

        return (
            <div className="superAdminCoursePage">
                <EnrollmentPaymentView
                    id={id}
                    onBack={() => setCurrentComponent("enrollment")}
                />
            </div>
        );
    }

    return (
        <div className="superAdminCoursePage">
            {/* =========================================
                PAGE HEADER
            ========================================== */}
            <div className="courseManagementHeader">
                <div>
                    <span className="courseManagementEyebrow">
                        COURSE MANAGEMENT
                    </span>
                    <h1>
                        Courses
                    </h1>
                    <p>
                        Create, manage and publish courses available
                        on the DSCH Education platform.
                    </p>
                </div>
                <button
                    className="courseEnrollmentBtn"
                    onClick={() => setCurrentComponent("enrollment")}
                >
                    <FaCertificate />
                    Enrollment Management
                    <FaArrowRight />
                </button>
            </div>
            {/* =========================================
                EXISTING COURSES
            ========================================== */}
            <section className="courseLibrary">
                <div className="courseLibraryHeader">
                    <div>
                        <h2>Existing Courses</h2>
                        <p>
                            Select a course to update its content,
                            pricing, enrollment settings, or status.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="courseRefreshBtn"
                        onClick={refreshCourses}
                        disabled={listLoading}
                    >
                        <FaSyncAlt
                            className={listLoading ? "isSpinning" : ""}
                        />
                        {listLoading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
                {listLoading && courses.length === 0 ? (
                    <div className="courseLibraryState">
                        Loading courses...
                    </div>
                ) : courses.length === 0 ? (
                    <div className="courseLibraryState">
                        No courses have been created yet.
                    </div>
                ) : (
                    <div className="courseLibraryGrid">
                        {courses.map((item) => (
                            <article
                                className={`courseLibraryCard ${
                                    editingId === item._id
                                        ? "isEditing"
                                        : ""
                                }`}
                                key={item._id}
                            >
                                <div className="courseLibraryCardTop">
                                    <span
                                        className={`courseStatusBadge status-${String(
                                            item.status || "DRAFT"
                                        ).toLowerCase()}`}
                                    >
                                        {item.status || "DRAFT"}
                                    </span>
                                    <span className="courseCodeBadge">
                                        {item.courseCode}
                                    </span>
                                </div>
                                <h3>{item.title}</h3>
                                <p>
                                    {item.shortDescription ||
                                        "No short description provided."}
                                </p>
                                <div className="courseLibraryMeta">
                                    <span>{item.category}</span>
                                    <span>{item.level}</span>
                                    <span>{item.mode}</span>
                                </div>
                                <div className="courseLibraryFooter">
                                    <div>
                                        <strong>
                                            {item.studentEnrolled || 0}
                                            {item.maxStudents
                                                ? ` / ${item.maxStudents}`
                                                : ""}
                                        </strong>
                                        <small> students enrolled</small>
                                    </div>
                                    <button
                                        type="button"
                                        className="courseEditBtn"
                                        onClick={() =>
                                            startEditing(item)
                                        }
                                    >
                                        <FaPen />
                                        {editingId === item._id
                                            ? "Editing"
                                            : "Edit Course"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
            {/* =========================================
                FORM
            ========================================== */}
            <form
                className={`courseCreateForm ${
                    editingId ? "isEditingCourse" : ""
                }`}
                onSubmit={handleSubmit}
            >
                <div className="courseFormIntro">
                    <div>
                        <span>
                            {editingId
                                ? "EDITING COURSE"
                                : "NEW COURSE"}
                        </span>
                        <h2>
                            {editingId
                                ? course.title || "Edit course"
                                : "Create a new course"}
                        </h2>
                        <p>
                            {editingId
                                ? "Update the course details below. Changes are applied immediately after saving."
                                : "Fill in the course information below. New courses are published immediately unless you choose another status."}
                        </p>
                    </div>
                    {editingId && (
                        <button
                            type="button"
                            className="courseCancelEditBtn"
                            onClick={resetForm}
                        >
                            <FaTimes />
                            Cancel Editing
                        </button>
                    )}
                </div>
                {/* =====================================
                    BASIC INFORMATION
                ====================================== */}
                <section className="courseFormSection">
                    <SectionHeader
                        number="01"
                        title="Basic Information"
                        description="Enter the main information that students will see about the course."
                    />
                    <div className="courseFormGrid">
                        <FormField
                            label="Course Title"
                            name="title"
                            value={course.title}
                            onChange={handleChange}
                            placeholder="e.g. Full Stack Web Development"
                            required
                        />
                        <FormField
                            label="Course Code"
                            name="courseCode"
                            value={course.courseCode}
                            onChange={handleChange}
                            placeholder="e.g. WEB-101"
                            required
                        />
                        <FormField
                            label="Category"
                            name="category"
                            value={course.category}
                            onChange={handleChange}
                            placeholder="e.g. Web Development"
                            required
                        />
                        <FormField
                            label="Duration"
                            name="duration"
                            value={course.duration}
                            onChange={handleChange}
                            placeholder="e.g. 12 Weeks"
                            required
                        />
                        <FormField
                            label="Language"
                            name="language"
                            value={course.language}
                            onChange={handleChange}
                            placeholder="e.g. English"
                            required
                        />
                        <FormField
                            label="Price"
                            name="price"
                            value={course.price}
                            onChange={handleChange}
                            placeholder="e.g. 1000"
                            required
                        />
                        <FormField
                            label="WhatsApp Group Link"
                            name="whatsappGroupLink"
                            value={course.whatsappGroupLink}
                            onChange={handleChange}
                            type="url"
                            placeholder="https://chat.whatsapp.com/example"
                        />
                        <div className="courseFormGroup">
                            <label>
                                Level
                            </label>
                            <select
                                name="level"
                                value={course.level}
                                onChange={handleChange}
                            >
                                <option value="BEGINNER">
                                    Beginner
                                </option>
                                <option value="INTERMEDIATE">
                                    Intermediate
                                </option>
                                <option value="ADVANCED">
                                    Advanced
                                </option>
                            </select>
                        </div>
                        <div className="courseFormGroup">
                            <label>
                                Learning Mode
                            </label>
                            <select
                                name="mode"
                                value={course.mode}
                                onChange={handleChange}
                            >
                                <option value="ONLINE">
                                    Online
                                </option>
                                <option value="ONSITE">
                                    Onsite
                                </option>
                            </select>
                        </div>
                        <FormField
                            label="Short Description"
                            name="shortDescription"
                            value={course.shortDescription}
                            onChange={handleChange}
                            placeholder="Short description shown on course cards"
                            full
                            required
                        />
                        <div className="courseFormGroup full">
                            <label>
                                Course Description
                            </label>
                            <textarea
                                name="description"
                                value={course.description}
                                onChange={handleChange}
                                placeholder="Write a detailed description of the course..."
                                rows="6"
                                required
                            />
                        </div>
                    </div>
                </section>
                {/* =====================================
                    COURSE PROVIDER
                ====================================== */}
                <section className="courseFormSection">
                    <SectionHeader
                        number="02"
                        title="Course Provider"
                        description="Provide the institute information that will be displayed publicly and used on certificates."
                    />
                    <div className="courseProviderNotice">
                        <FaCertificate />
                        <div>
                            <strong>
                                Certificate Provider Information
                            </strong>
                            <p>
                                The institute name and logo entered here
                                can be preserved as a snapshot when a
                                certificate is issued.
                            </p>
                        </div>
                    </div>
                    <div className="courseFormGrid">
                        <FormField
                            label="Course Offered By"
                            name="offeredByInstitute"
                            value={course.offeredByInstitute}
                            onChange={handleChange}
                            placeholder="Institute name"
                            required
                        />
                        <FormField
                            label="Institute Logo URL"
                            name="offeredByInstituteLogoUrl"
                            value={course.offeredByInstituteLogoUrl}
                            type="url"
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>
                </section>
                {/* =====================================
                    COURSE MEDIA
                ====================================== */}
                <section className="courseFormSection">
                    <SectionHeader
                        number="03"
                        title="Course Media"
                        description="Add the course thumbnail that will appear on public course listings."
                    />
                    <div className="courseMediaBox">
                        <div className="courseMediaIcon">
                            <FaImage />
                        </div>
                        <div className="courseMediaContent">
                            <label>
                                Course Image URL
                            </label>
                            <input
                                name="thumbnail"
                                value={course.thumbnail}
                                onChange={handleChange}
                                type="url"
                                placeholder="https://..."
                            />
                            <small>
                                Use a public image URL. This can later
                                be replaced with Cloudinary upload.
                            </small>
                        </div>
                    </div>
                </section>
                {/* =====================================
                    LEARNING OUTCOMES
                ====================================== */}
                <section className="courseFormSection">
                    <SectionHeader
                        number="04"
                        title="Learning Outcomes"
                        description="What will students be able to learn or accomplish after completing this course?"
                    />
                    <DynamicList
                        items={course.learningOutcomes}
                        field="learningOutcomes"
                        placeholder="e.g. Build responsive web applications"
                        handleChange={handleArrayChange}
                        addItem={addArrayItem}
                        removeItem={removeArrayItem}
                    />
                </section>
                {/* =====================================
                    REQUIREMENTS
                ====================================== */}
                <section className="courseFormSection">
                    <SectionHeader
                        number="05"
                        title="Requirements"
                        description="Mention what a student needs before starting the course."
                    />
                    <DynamicList
                        items={course.requirements}
                        field="requirements"
                        placeholder="e.g. Basic computer knowledge"
                        handleChange={handleArrayChange}
                        addItem={addArrayItem}
                        removeItem={removeArrayItem}
                    />
                </section>
                {/* =====================================
                    TARGET AUDIENCE
                ====================================== */}
                <section className="courseFormSection">
                    <SectionHeader
                        number="06"
                        title="Who This Course Is For"
                        description="Define the students or learners this course is intended for."
                    />
                    <DynamicList
                        items={course.targetAudience}
                        field="targetAudience"
                        placeholder="e.g. Students interested in web development"
                        handleChange={handleArrayChange}
                        addItem={addArrayItem}
                        removeItem={removeArrayItem}
                    />
                </section>
                {/* =====================================
                    CURRICULUM
                ====================================== */}
                <section className="courseFormSection">
                    <SectionHeader
                        number="07"
                        title="Course Curriculum"
                        description="Create modules and add lessons inside each module."
                    />
                    <div className="curriculumHeader">
                        <div>
                            <h3>
                                Modules
                            </h3>
                            <p>
                                Organize the course into logical learning
                                sections.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="addModuleBtn"
                            onClick={addModule}
                        >
                            <FaPlus />
                            Add Module
                        </button>
                    </div>
                    <div className="courseModules">
                        {course.modules.length === 0 && (
                            <div className="emptyModuleState">
                                No modules added yet.
                            </div>

                        )}
                        {course.modules.map(
                            (module, moduleIndex) => (
                                <div
                                    className="courseModuleEditor"
                                    key={moduleIndex}
                                >
                                    <div className="moduleEditorHeader">
                                        <span>
                                            MODULE {moduleIndex + 1}
                                        </span>
                                        <button
                                            type="button"
                                            className="removeModuleBtn"
                                            onClick={() =>
                                                removeModule(
                                                    moduleIndex
                                                )
                                            }
                                        >
                                            <FaTrash />
                                            Remove
                                        </button>
                                    </div>
                                    <div className="courseFormGrid">
                                        <FormField
                                            label="Module Title"
                                            value={module.title}
                                            placeholder="e.g. Introduction to JavaScript"
                                            onChange={(e) =>
                                                updateModule(
                                                    moduleIndex,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            full
                                        />
                                        <div className="courseFormGroup full">
                                            <label>
                                                Module Description
                                            </label>
                                            <textarea
                                                value={
                                                    module.description
                                                }
                                                onChange={(e) =>
                                                    updateModule(
                                                        moduleIndex,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Briefly describe this module..."
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                    {/* LESSONS */}
                                    <div className="lessonsEditor">
                                        <div className="lessonsEditorHeader">
                                            <div>
                                                <h4>
                                                    Lessons
                                                </h4>
                                                <p>
                                                    Add the lessons included
                                                    in this module.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                className="addLessonBtn"
                                                onClick={() =>
                                                    addLesson(
                                                        moduleIndex
                                                    )
                                                }
                                            >
                                                <FaPlus />
                                                Add Lesson
                                            </button>
                                        </div>
                                        {module.lessons.map(
                                            (lesson, lessonIndex) => (
                                                <div
                                                    className="lessonEditorRow"
                                                    key={lessonIndex}
                                                >
                                                    <span>
                                                        {lessonIndex + 1}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={lesson}
                                                        onChange={(e) =>
                                                            updateLesson(
                                                                moduleIndex,
                                                                lessonIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Lesson title"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeLesson(
                                                                moduleIndex,
                                                                lessonIndex
                                                            )
                                                        }
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>
                {/* =====================================
                    ENROLLMENT
                ====================================== */}
                <section className="courseFormSection">
                    <SectionHeader
                        number="08"
                        title="Enrollment & Certificate"
                        description="Configure how students can enroll and whether successful students receive certificates."
                    />
                    <div className="courseSettingsGrid">
                        <label className="courseToggle">
                            <input
                                type="checkbox"
                                name="enrollmentOpen"
                                checked={
                                    course.enrollmentOpen
                                }
                                onChange={handleChange}
                            />
                            <span className="toggleVisual"></span>
                            <div>
                                <strong>
                                    Enrollment Open
                                </strong>
                                <small>
                                    Allow students to enroll in this course.
                                </small>
                            </div>
                        </label>
                        <label className="courseToggle">
                            <input
                                type="checkbox"
                                name="certificateAvailable"
                                checked={
                                    course.certificateAvailable
                                }
                                onChange={handleChange}
                            />
                            <span className="toggleVisual"></span>
                            <div>
                                <strong>
                                    Certificate Available
                                </strong>
                                <small>
                                    Students can receive a course completion certificate.
                                </small>
                            </div>
                        </label>
                    </div>
                    <div className="courseFormGrid">
                        <div className="courseFormGroup">
                            <label>
                                Course Status
                            </label>
                            <select
                                name="status"
                                value={course.status}
                                onChange={handleChange}
                            >
                                <option value="DRAFT">
                                    Draft
                                </option>
                                <option value="PUBLISHED">
                                    Published
                                </option>
                                <option value="ARCHIVED">
                                    Archived
                                </option>
                            </select>
                        </div>
                        <FormField
                            label="Enrollment Start Date"
                            name="enrollmentStart"
                            type="date"
                            value={course.enrollmentStart}
                            onChange={handleChange}
                            placeholder="Enrollment Start Date"
                        />
                        <FormField
                            label="Enrollment End Date"
                            name="enrollmentEnd"
                            type="date"
                            value={course.enrollmentEnd}
                            onChange={handleChange}
                            placeholder="Enrollment End Date"
                        />
                        <FormField
                            label="Maximum Students"
                            name="maxStudents"
                            type="number"
                            value={course.maxStudents}
                            onChange={handleChange}
                            placeholder="Leave empty for unlimited"
                        />
                    </div>
                </section>
                {/* =====================================
                    SUBMIT
                ====================================== */}
                <div className="courseFormActions">
                    <button
                        type="submit"
                        className="publishCourseBtn"
                        disabled={loading}
                    >
                        {editingId ? <FaPen /> : <FaBookOpen />}
                        {loading
                            ? "Saving..."
                            : editingId
                                ? "Save Changes"
                                : "Create Course"}
                        {!loading && (
                            <FaArrowRight />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

/* =====================================================
   SECTION HEADER
===================================================== */

const SectionHeader = ({
    number,
    title,
    description
}) => {
    return (
        <div className="superAdminCourseSectionHeading">
            <span>
                {number}
            </span>
            <div>
                <h2>
                    {title}
                </h2>
                <p>
                    {description}
                </p>
            </div>
        </div>
    );
};

/* =====================================================
   FORM FIELD
===================================================== */
const FormField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    type = "text",
    full = false
}) => {
    return (
        <div
            className={`courseFormGroup ${full ? "full" : ""
                }`}
        >
            <label>
                {label}
                {required && (
                    <span>
                        *
                    </span>
                )}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
};

/* =====================================================
   DYNAMIC LIST
===================================================== */
const DynamicList = ({
    items,
    field,
    placeholder,
    handleChange,
    addItem,
    removeItem
}) => {
    return (
        <div className="dynamicList">
            {items.map((item, index) => (
                <div
                    className="dynamicListRow"
                    key={index}
                >
                    <span>
                        {index + 1}
                    </span>
                    <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                            handleChange(
                                field,
                                index,
                                e.target.value
                            )
                        }
                        placeholder={placeholder}
                    />
                    {items.length > 1 && (
                        <button
                            type="button"
                            onClick={() =>
                                removeItem(
                                    field,
                                    index
                                )
                            }
                        >
                            <FaTrash />
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="addListItemBtn"
                onClick={() => addItem(field)}
            >
                <FaPlus />
                Add Item
            </button>
        </div>
    );
};