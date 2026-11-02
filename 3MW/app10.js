// import * as THREE from "./three.min.js";


// ============================================
// APPLICATION STATE
// ============================================

const state = {

    language: "en",

    page: "home",

    level: "beginner",

    groups: 3,

    objects: 4,

    table: 3,

    question: [3, 4],

    answered: false,

    progress: loadProgress()

};


function loadProgress() {

    try {

        return JSON.parse(
            localStorage.getItem("mw-progress")
        ) || {
            questions: 0,
            correct: 0,
            stars: 0
        };

    } catch {

        return {
            questions: 0,
            correct: 0,
            stars: 0
        };

    }

}


function saveProgress() {

    localStorage.setItem(
        "mw-progress",
        JSON.stringify(state.progress)
    );

}


// ============================================
// TRANSLATIONS
// ============================================

const translations = {

    en: {

        title: "Multiplication World",

        home: "Home",

        classroom: "Classroom",

        lab: "3D Laboratory",

        galaxy: "Math Galaxy",

        tables: "Times Tables",

        games: "Games",

        progress: "Progress",

        welcome: "Welcome, Math Explorer!",

        welcomeText: "Discover the exciting world of multiplication.",

        questions: "Questions",

        correct: "Correct Answers",

        stars: "Stars Earned"

    },

    ar: {

        title: "عالم الضرب",

        home: "الرئيسية",

        classroom: "الفصل الدراسي",

        lab: "مختبر ثلاثي الأبعاد",

        galaxy: "مجرة الرياضيات",

        tables: "جداول الضرب",

        games: "الألعاب",

        progress: "التقدم",

        welcome: "مرحباً أيها المستكشف!",

        welcomeText: "اكتشف عالم الضرب الممتع.",

        questions: "الأسئلة",

        correct: "الإجابات الصحيحة",

        stars: "النجوم المكتسبة"

    }

};


function translate() {

    const t = translations[state.language];

    document.documentElement.lang = state.language;

    document.documentElement.dir =
        state.language === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key = element.dataset.i18n;

            if (t[key]) {
                element.textContent = t[key];
            }

        });

    document.getElementById("languageButton").textContent =
        state.language === "en" ? "🌐 العربية" : "🌐 English";

}


// ============================================
// NAVIGATION
// ============================================

function navigate(page) {

    state.page = page;

    document.querySelectorAll(".page")
        .forEach(element => {

            element.classList.toggle(
                "active",
                element.id === page
            );

        });

    document.querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });

    if (page === "lab") {
        resizeLab();
    }

    if (page === "galaxy") {
        resizeGalaxy();
    }

}


document.querySelectorAll("[data-page]")
    .forEach(button => {

        button.addEventListener("click", () => {
            navigate(button.dataset.page);
        });

    });


document.querySelectorAll("[data-go]")
    .forEach(button => {

        button.addEventListener("click", () => {
            navigate(button.dataset.go);
        });

    });


// ============================================
// LANGUAGE
// ============================================

document.getElementById("languageButton")
    .addEventListener("click", () => {

        state.language =
            state.language === "en" ? "ar" : "en";

        translate();

    });


// ============================================
// STUDENT LEVEL
// ============================================

document.querySelectorAll("[data-level]")
    .forEach(button => {

        button.addEventListener("click", () => {

            state.level = button.dataset.level;

            document.querySelectorAll("[data-level]")
                .forEach(item => {
                    item.classList.toggle(
                        "selected",
                        item === button
                    );
                });

            updateProfile();

        });

    });


function updateProfile() {

    const labels = {

        beginner: {
            en: "Explorer",
            ar: "المستكشف"
        },

        intermediate: {
            en: "Adventurer",
            ar: "المغامر"
        },

        advanced: {
            en: "Math Master",
            ar: "بطل الرياضيات"
        }

    };

    document.getElementById("studentLevel").textContent =
        labels[state.level][state.language];

}


// ============================================
// PROGRESS
// ============================================

function updateProgress() {

    const p = state.progress;

    document.getElementById("totalQuestions").textContent =
        p.questions;

    document.getElementById("totalCorrect").textContent =
        p.correct;

    document.getElementById("totalStars").textContent =
        p.stars;

    document.getElementById("starCount").textContent =
        p.stars;

    const accuracy = p.questions
        ? Math.round(p.correct / p.questions * 100)
        : 0;

    document.getElementById("accuracyValue").textContent =
        accuracy + "%";

    document.getElementById("progressFill").style.width =
        accuracy + "%";

    updateAchievements();

}


function updateAchievements() {

    const achievements = [

        {
            icon: "🌱",
            name: "First Steps",
            requirement: "Complete your first question.",
            unlocked: state.progress.questions >= 1
        },

        {
            icon: "⭐",
            name: "Rising Star",
            requirement: "Earn 10 stars.",
            unlocked: state.progress.stars >= 10
        },

        {
            icon: "🚀",
            name: "Math Adventurer",
            requirement: "Answer 25 questions correctly.",
            unlocked: state.progress.correct >= 25
        },

        {
            icon: "🏆",
            name: "Multiplication Master",
            requirement: "Answer 100 questions correctly.",
            unlocked: state.progress.correct >= 100
        }

    ];

    const container =
        document.getElementById("achievementList");

    container.innerHTML = "";

    achievements.forEach(item => {

        const div = document.createElement("div");

        div.className =
            "achievement " +
            (item.unlocked ? "" : "locked");

        div.textContent =
            `${item.icon} ${item.name} — ${item.requirement} ` +
            (item.unlocked ? "✅" : "🔒");

        container.appendChild(div);

    });

}


document.getElementById("resetProgress")
    .addEventListener("click", () => {

        if (!confirm("Reset all learning progress?")) return;

        state.progress = {
            questions: 0,
            correct: 0,
            stars: 0
        };

        saveProgress();

        updateProgress();

    });


// ============================================
// MULTIPLICATION TABLES
// ============================================

function renderTable(number) {

    const container =
        document.getElementById("tableGrid");

    container.innerHTML = "";

    for (let i = 1; i <= 12; i++) {

        const item = document.createElement("div");

        item.className = "table-item";

        item.textContent =
            `${number} × ${i} = ${number * i}`;

        container.appendChild(item);

    }

}


document.getElementById("tableSelect")
    .addEventListener("change", event => {

        renderTable(Number(event.target.value));

    });


renderTable(1);


// ============================================
// QUIZ ENGINE
// ============================================

function generateQuestion() {

    let max = 5;

    if (state.level === "intermediate") max = 10;

    if (state.level === "advanced") max = 12;

    const accuracy = state.progress.questions
        ? state.progress.correct / state.progress.questions
        : 0;

    if (accuracy >= 0.85) {
        max = Math.min(12, max + 2);
    }

    const a = Math.floor(Math.random() * max) + 1;

    const b = Math.floor(Math.random() * max) + 1;

    state.question = [a, b];

    state.answered = false;

    document.getElementById("quizQuestion").textContent =
        `${a} × ${b} = ?`;

    document.getElementById("quizAnswer").value = "";

    document.getElementById("quizFeedback").textContent = "";

}


function checkAnswer() {

    if (state.answered) return;

    const input = document.getElementById("quizAnswer");

    if (input.value.trim() === "") return;

    const answer = Number(input.value);

    const correct =
        state.question[0] * state.question[1];

    state.progress.questions++;

    if (answer === correct) {

        state.progress.correct++;

        state.progress.stars++;

        state.answered = true;

        document.getElementById("quizFeedback").textContent =
            "🎉 Excellent! You got it right!";

    } else {

        document.getElementById("quizFeedback").textContent =
            "💡 Not quite! Try again.";

    }

    saveProgress();

    updateProgress();

}


document.getElementById("checkAnswer")
    .addEventListener("click", checkAnswer);


document.getElementById("nextQuestion")
    .addEventListener("click", generateQuestion);


document.getElementById("quizAnswer")
    .addEventListener("keydown", event => {

        if (event.key === "Enter") {
            checkAnswer();
        }

    });


// ============================================
// 3D LABORATORY
// ============================================

let labScene;
let labCamera;
let labRenderer;
let labGroup;

const labElement =
    document.getElementById("labScene");


function createLab() {

    labScene = new THREE.Scene();

    labScene.background =
        new THREE.Color("#172d50");

    labCamera = new THREE.PerspectiveCamera(
        45,
        1,
        0.1,
        100
    );

    labCamera.position.set(10, 9, 13);

    labRenderer = new THREE.WebGLRenderer({
        antialias: true
    });

    labRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    labElement.appendChild(
        labRenderer.domElement
    );

    labScene.add(
        new THREE.HemisphereLight(
            0xffffff,
            0x526b91,
            2
        )
    );

    const light = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    light.position.set(5, 10, 8);

    labScene.add(light);

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({
            color: "#142541"
        })
    );

    floor.rotation.x = -Math.PI / 2;

    floor.position.y = -0.5;

    labScene.add(floor);

    labGroup = new THREE.Group();

    labScene.add(labGroup);

    updateLab();

    resizeLab();

    animateLab();

}


function clearLab() {

    while (labGroup.children.length) {

        const child = labGroup.children[0];

        labGroup.remove(child);

        child.traverse(object => {

            if (!object.isMesh) return;

            object.geometry.dispose();

            if (Array.isArray(object.material)) {
                object.material.forEach(m => m.dispose());
            } else {
                object.material.dispose();
            }

        });

    }

}


function updateLab() {

    if (!labGroup) return;

    clearLab();

    const colors = [
        "#ff595e",
        "#ffca3a",
        "#8ac926",
        "#1982c4",
        "#a66cff",
        "#00cec9",
        "#ff9f43",
        "#f368e0"
    ];

    const geometry =
        new THREE.BoxGeometry(0.65, 0.65, 0.65);

    const groupCount = state.groups;

    const objectCount = state.objects;

    for (let i = 0; i < groupCount; i++) {

        const objectGroup = new THREE.Group();

        const material = new THREE.MeshStandardMaterial({
            color: colors[i % colors.length],
            roughness: 0.35
        });

        for (let j = 0; j < objectCount; j++) {

            const cube = new THREE.Mesh(
                geometry,
                material
            );

            cube.position.set(
                (j % 5) * 0.8 - 1.6,
                Math.floor(j / 5) * 0.8,
                0
            );

            objectGroup.add(cube);

        }

        const columns = Math.min(4, groupCount);

        objectGroup.position.set(
            (i % columns - (columns - 1) / 2) * 3.2,
            0,
            Math.floor(i / columns) * 3
        );

        labGroup.add(objectGroup);

    }

    labCamera.position.set(
        Math.max(10, groupCount * 1.2),
        Math.max(8, groupCount * 0.8),
        13
    );

    labCamera.lookAt(0, 0, 0);

    document.getElementById("labEquation").textContent =
        `${groupCount} × ${objectCount} = ${groupCount * objectCount}`;

    document.getElementById("labExplanation").textContent =
        Array(groupCount).fill(objectCount).join(" + ") +
        " = " +
        groupCount * objectCount;

}


function resizeLab() {

    if (!labRenderer || !labElement.clientWidth) return;

    const width = labElement.clientWidth;

    const height = labElement.clientHeight;

    labCamera.aspect = width / height;

    labCamera.updateProjectionMatrix();

    labRenderer.setSize(width, height);

}


function animateLab() {

    requestAnimationFrame(animateLab);

    if (!labRenderer) return;

    if (!labGroup) return;

    labGroup.rotation.y += 0.0015;

    labRenderer.render(labScene, labCamera);

}


document.getElementById("groupRange")
    .addEventListener("input", event => {

        state.groups = Number(event.target.value);

        document.getElementById("groupValue").textContent =
            state.groups;

        updateLab();

    });


document.getElementById("objectRange")
    .addEventListener("input", event => {

        state.objects = Number(event.target.value);

        document.getElementById("objectValue").textContent =
            state.objects;

        updateLab();

    });


// ============================================
// 3D GALAXY
// ============================================

let galaxyScene;
let galaxyCamera;
let galaxyRenderer;
let galaxyGroup;

const galaxyElement =
    document.getElementById("galaxyScene");


function createGalaxy() {

    galaxyScene = new THREE.Scene();

    galaxyScene.background =
        new THREE.Color("#090d27");

    galaxyCamera = new THREE.PerspectiveCamera(
        55,
        1,
        0.1,
        100
    );

    galaxyCamera.position.set(0, 7, 16);

    galaxyRenderer = new THREE.WebGLRenderer({
        antialias: true
    });

    galaxyRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    galaxyElement.appendChild(
        galaxyRenderer.domElement
    );

    galaxyScene.add(
        new THREE.AmbientLight(0xffffff, 2)
    );

    const sun = new THREE.PointLight(
        0xffffff,
        100
    );

    galaxyScene.add(sun);

    galaxyGroup = new THREE.Group();

    galaxyScene.add(galaxyGroup);

    const sunGeometry =
        new THREE.SphereGeometry(1.2, 32, 32);

    const sunMaterial =
        new THREE.MeshBasicMaterial({
            color: "#ffcb58"
        });

    galaxyGroup.add(
        new THREE.Mesh(sunGeometry, sunMaterial)
    );

    const colors = [
        "#42cdf5",
        "#9b72cf",
        "#50dfa0",
        "#ff595e",
        "#ffd166",
        "#ff9f43"
    ];

    colors.forEach((color, i) => {

        const angle = i / colors.length * Math.PI * 2;

        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.5 + i * 0.08,
                32,
                32
            ),

            new THREE.MeshStandardMaterial({
                color,
                roughness: 0.6
            })
        );

        planet.position.set(
            Math.cos(angle) * (3 + i * 0.5),
            0,
            Math.sin(angle) * (3 + i * 0.5)
        );

        galaxyGroup.add(planet);

    });

    resizeGalaxy();

    animateGalaxy();

}


function resizeGalaxy() {

    if (!galaxyRenderer || !galaxyElement.clientWidth) return;

    const width = galaxyElement.clientWidth;

    const height = galaxyElement.clientHeight;

    galaxyCamera.aspect = width / height;

    galaxyCamera.updateProjectionMatrix();

    galaxyRenderer.setSize(width, height);

}


function animateGalaxy() {

    requestAnimationFrame(animateGalaxy);

    if (!galaxyRenderer) return;

    galaxyGroup.rotation.y += 0.002;

    galaxyRenderer.render(
        galaxyScene,
        galaxyCamera
    );

}


document.querySelectorAll("[data-table]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const number = Number(button.dataset.table);

            document.getElementById("planetMessage").textContent =
                `🚀 Welcome to Planet ${number}! ` +
                `Explore: ${Array.from(
                    { length: 12 },
                    (_, i) => `${number} × ${i + 1} = ${number * (i + 1)}`
                ).join(" | ")}`;

            document.getElementById("tableSelect").value =
                number;

        });

    });


// ============================================
// RESIZE
// ============================================

window.addEventListener("resize", () => {

    resizeLab();

    resizeGalaxy();

});


// ============================================
// INITIALIZATION
// ============================================

createLab();

createGalaxy();

generateQuestion();

translate();

updateProgress();

updateProfile();

navigate("home");


// Restore default learning table.

document.getElementById("tableSelect").value = "1";