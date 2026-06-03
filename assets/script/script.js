const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipeContainer = document.getElementById("recipe-container");
const recipeModal = document.getElementById("recipe-modal");
const recipeDetailsContent = document.getElementById("recipe-details-content");
const recipeCloseBtn = document.querySelector(".close-btn");
const recomText = document.getElementById("recomText");
const searchText = document.getElementById("searchText");

const desktopTabCategories = document.getElementById("tab-categories");
const desktopTabCuisines = document.getElementById("tab-cuisines");
const desktopSidebarList = document.getElementById("sidebar-list");

const mobileFilterTrigger = document.getElementById("mobile-filter-trigger");
const mobileFilterBackdrop = document.getElementById("mobile-filter-backdrop");
const mobileFilterSheet = document.getElementById("mobile-filter-sheet");
const closeMobileFilters = document.getElementById("close-mobile-filters");
const mobileTabCategories = document.getElementById("mobile-tab-categories");
const mobileTabCuisines = document.getElementById("mobile-tab-cuisines");
const mobileSidebarList = document.getElementById("mobile-sidebar-list");

const paginationContainer = document.getElementById("pagination-container");

const themeToggleBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

const categories = [
  "All",
  "Chicken",
  "Beef",
  "Lamb",
  "Seafood",
  "Vegan",
  "Vegetarian",
  "Dessert",
  "Starter",
  "Side",
  "Breakfast",
];
const cuisines = [
  "Italian",
  "Spanish",
  "Greek",
  "Chinese",
  "Japanese",
  "Thai",
  "Vietnamese",
  "Mexican",
  "Turkish",
  "Moroccan",
  "British",
  "Canadian",
  "Jamaican",
];

const categoryGroups = {
  "DAILY FAVOURITES": ["All"],
  "MEAT & POULTRY": ["Chicken", "Beef", "Lamb"],
  "FROM THE SEA": ["Seafood"],
  "PLANT BASED": ["Vegan", "Vegetarian"],
  "SWEET TREATS": ["Dessert"],
  "LIGHT BITES": ["Starter", "Side", "Breakfast"],
};

const cuisineGroups = {
  EUROPEAN: ["Italian", "Spanish", "Greek", "British"],
  ASIAN: ["Chinese", "Japanese", "Thai", "Vietnamese"],
  AMERICAN: ["Mexican", "Canadian", "Jamaican"],
  "MIDDLE EASTERN": ["Turkish", "Moroccan"],
};

let currentFilterMode = "categories";
let selectedFilter = "All";

let currentRecipes = [];
let currentPage = 1;
const recipesPerPage = 6;

function matchCardHeight() {
  const desktopSidebar = document.getElementById("desktop-sidebar");
  const gridHeader = document.getElementById("grid-header");
  if (!desktopSidebar) return;

  if (window.innerWidth >= 768) {
    const sidebarHeight = desktopSidebar.offsetHeight;
    const headerHeight = gridHeader ? gridHeader.offsetHeight : 0;

    if (sidebarHeight > 0) {
      const cardHeight = (sidebarHeight - headerHeight - 48) / 2;
      if (cardHeight > 0) {
        document.querySelectorAll(".card").forEach((card) => {
          card.style.height = `${cardHeight}px`;
        });
        document.querySelectorAll(".recipe-skeleton").forEach((skeleton) => {
          skeleton.style.height = `${cardHeight}px`;
        });
      }
    }
  } else {
    document.querySelectorAll(".card").forEach((card) => {
      card.style.height = "";
    });
    document.querySelectorAll(".recipe-skeleton").forEach((skeleton) => {
      skeleton.style.height = "";
    });
  }
}

window.addEventListener("resize", matchCardHeight);

if (
  localStorage.getItem("theme") === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  htmlElement.classList.add("dark");
  themeToggleBtn.querySelector("i").className = "fa-solid fa-sun text-base";
} else {
  htmlElement.classList.remove("dark");
  themeToggleBtn.querySelector("i").className = "fa-solid fa-moon text-base";
}

themeToggleBtn.addEventListener("click", () => {
  if (htmlElement.classList.contains("dark")) {
    htmlElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    themeToggleBtn.querySelector("i").className = "fa-solid fa-moon text-base";
  } else {
    htmlElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    themeToggleBtn.querySelector("i").className = "fa-solid fa-sun text-base";
  }
});

function openModal() {
  recipeModal.classList.remove("hidden");
  recipeModal.offsetHeight;
  recipeModal.classList.add("bg-slate-900/40", "dark:bg-slate-950/60");
  const modalContent = recipeModal.querySelector(".modal-content");
  modalContent.classList.add("scale-100", "opacity-100");
  modalContent.classList.remove("scale-95", "opacity-0");
}

function closeModal() {
  const modalContent = recipeModal.querySelector(".modal-content");
  modalContent.classList.remove("scale-100", "opacity-100");
  modalContent.classList.add("scale-95", "opacity-0");
  recipeModal.classList.remove("bg-slate-900/40", "dark:bg-slate-950/60");
  setTimeout(() => {
    recipeModal.classList.add("hidden");
  }, 300);
}

recipeModal.addEventListener("click", (e) => {
  if (e.target === recipeModal) {
    closeModal();
  }
});

recipeCloseBtn.addEventListener("click", closeModal);

function openMobileFiltersSheet() {
  mobileFilterBackdrop.classList.remove("hidden");
  mobileFilterBackdrop.offsetHeight;
  mobileFilterBackdrop.classList.add("opacity-100");
  mobileFilterBackdrop.classList.remove("opacity-0");
  mobileFilterSheet.classList.add("bottom-sheet-active");
  mobileFilterSheet.classList.remove("bottom-sheet-inactive");
}

function closeMobileFiltersSheet() {
  mobileFilterBackdrop.classList.remove("opacity-100");
  mobileFilterBackdrop.classList.add("opacity-0");
  mobileFilterSheet.classList.remove("bottom-sheet-active");
  mobileFilterSheet.classList.add("bottom-sheet-inactive");
  setTimeout(() => {
    mobileFilterBackdrop.classList.add("hidden");
  }, 300);
}

mobileFilterTrigger.addEventListener("click", openMobileFiltersSheet);
closeMobileFilters.addEventListener("click", closeMobileFiltersSheet);
mobileFilterBackdrop.addEventListener("click", (e) => {
  if (e.target === mobileFilterBackdrop) {
    closeMobileFiltersSheet();
  }
});

function renderSidebarFilters() {
  desktopSidebarList.innerHTML = "";
  mobileSidebarList.innerHTML = "";

  const groups =
    currentFilterMode === "categories" ? categoryGroups : cuisineGroups;

  Object.entries(groups).forEach(([groupName, items]) => {
    const createGroup = () => {
      const groupContainer = document.createElement("div");
      groupContainer.className = "flex flex-col gap-2";

      const heading = document.createElement("h4");
      heading.className =
        "text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-550 uppercase px-3 mb-1 select-none";
      heading.textContent = groupName;
      groupContainer.appendChild(heading);

      const listContainer = document.createElement("div");
      listContainer.className = "flex flex-col gap-1";

      items.forEach((item) => {
        const btn = document.createElement("button");
        const isActive = item === selectedFilter;

        btn.className = isActive
          ? "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-white dark:text-slate-950 shadow-sm transition-all duration-200 cursor-pointer border-none outline-none"
          : "w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-250 transition-all duration-200 cursor-pointer border-none outline-none";

        btn.innerHTML = `
                    <span>${item}</span>
                    <i class="fa-solid ${isActive ? "fa-chevron-right text-[10px]" : "fa-angle-right text-slate-400 text-[10px]"}"></i>
                `;

        btn.addEventListener("click", () => {
          selectedFilter = item;
          renderSidebarFilters();
          closeMobileFiltersSheet();
          handleFilterSelect(item);
        });

        listContainer.appendChild(btn);
      });

      groupContainer.appendChild(listContainer);
      return groupContainer;
    };

    desktopSidebarList.appendChild(createGroup());
    mobileSidebarList.appendChild(createGroup());
  });
  matchCardHeight();
}

function handleFilterSelect(value) {
  if (currentFilterMode === "categories") {
    if (value === "All") {
      recomText.style.display = "block";
      searchText.innerHTML = "";
      fetchFavMeals();
    } else {
      recomText.style.display = "none";
      searchText.innerHTML = `
                <h2 class="text-xl md:text-2xl font-serif font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <i class="fa-solid fa-filter text-amber-500 text-lg"></i>
                    <span>Category: ${value}</span>
                </h2>
            `;
      filterRecipes("c", value);
    }
  } else {
    recomText.style.display = "none";
    searchText.innerHTML = `
            <h2 class="text-xl md:text-2xl font-serif font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-filter text-amber-500 text-lg"></i>
                <span>Cuisine: ${value}</span>
            </h2>
        `;
    filterRecipes("a", value);
  }
}

function switchFilterMode(mode) {
  currentFilterMode = mode;

  if (mode === "categories") {
    desktopTabCategories.className =
      "flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border-none outline-none";
    desktopTabCuisines.className =
      "flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 border-none outline-none";

    mobileTabCategories.className =
      "flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border-none outline-none";
    mobileTabCuisines.className =
      "flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all text-slate-400 dark:text-slate-500 border-none outline-none";

    selectedFilter = "All";
  } else {
    desktopTabCategories.className =
      "flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 border-none outline-none";
    desktopTabCuisines.className =
      "flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border-none outline-none";

    mobileTabCategories.className =
      "flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all text-slate-400 dark:text-slate-500 border-none outline-none";
    mobileTabCuisines.className =
      "flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border-none outline-none";

    selectedFilter = cuisines[0];
  }

  renderSidebarFilters();
  handleFilterSelect(selectedFilter);
}

desktopTabCategories.addEventListener("click", () =>
  switchFilterMode("categories"),
);
desktopTabCuisines.addEventListener("click", () =>
  switchFilterMode("cuisines"),
);
mobileTabCategories.addEventListener("click", () =>
  switchFilterMode("categories"),
);
mobileTabCuisines.addEventListener("click", () => switchFilterMode("cuisines"));

function showSkeletons() {
  paginationContainer.innerHTML = "";
  recipeContainer.innerHTML = Array(6)
    .fill(0)
    .map(
      () => `
        <div class="recipe-skeleton bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800/80 overflow-hidden shadow-sm p-4 animate-pulse-slow shimmer-wrapper w-full max-w-lg flex flex-col">
            <div class="flex-grow h-0 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
            <div class="space-y-2 mt-4 shrink-0">
                <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-1/4"></div>
                <div class="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4"></div>
                <div class="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-full mt-4"></div>
            </div>
        </div>
    `,
    )
    .join("");
  matchCardHeight();
}

function showErrorState(retryAction, retryParam = null) {
  paginationContainer.innerHTML = "";
  recipeContainer.innerHTML = `
        <div class="col-span-full py-12 flex flex-col items-center justify-center text-center w-full">
            <div class="w-16 h-16 bg-red-50 dark:bg-slate-900 text-red-500 rounded-full flex items-center justify-center mb-4 text-2xl border border-red-100/50 dark:border-slate-800">
                <i class="fa-solid fa-circle-exclamation"></i>
            </div>
            <h3 class="text-lg font-serif font-bold text-slate-800 dark:text-slate-200 mb-1">Failed to load recipes</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">Please check your network connection and try again.</p>
            <button id="retry-btn" class="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-md active:scale-95 transition-all cursor-pointer border-none outline-none">
                Try Again
            </button>
        </div>
    `;
  const retryBtn = document.getElementById("retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      if (retryAction === "fetchFavMeals") {
        fetchFavMeals();
      } else if (retryAction === "filterRecipes") {
        filterRecipes(retryParam.param, retryParam.value);
      } else if (retryAction === "fetchRecipes") {
        fetchRecipes(retryParam);
      }
    });
  }
}

function renderPaginatedRecipes() {
  recipeContainer.innerHTML = "";

  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const paginatedItems = currentRecipes.slice(startIndex, endIndex);

  if (paginatedItems.length === 0) {
    recipeContainer.innerHTML = `
            <div class="col-span-full py-12 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 bg-amber-50 dark:bg-slate-900 text-amber-500 rounded-full flex items-center justify-center mb-4 text-2xl border border-amber-100/50 dark:border-slate-800">
                    <i class="fa-solid fa-utensils"></i>
                </div>
                <h3 class="text-lg font-serif font-bold text-slate-850 dark:text-slate-200 mb-1">No Recipes Found</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Try selecting another filter or searching for something else!</p>
            </div>
        `;
    renderPaginationControls();
    return;
  }

  paginatedItems.forEach((recipe) => addMealToDOM(recipe));
  renderPaginationControls();
  matchCardHeight();
}

function renderPaginationControls() {
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(currentRecipes.length / recipesPerPage);
  if (totalPages <= 1) {
    return;
  }

  const prevBtn = document.createElement("button");
  prevBtn.className =
    "w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-slate-950 transition-all duration-200 flex items-center justify-center cursor-pointer border-none outline-none disabled:opacity-40 disabled:cursor-not-allowed";
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left text-xs"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPaginatedRecipes();
      window.scrollTo({
        top: recipeContainer.offsetTop - 120,
        behavior: "smooth",
      });
    }
  });
  paginationContainer.appendChild(prevBtn);

  const pageIndicator = document.createElement("span");
  pageIndicator.className =
    "px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-150/50 dark:bg-slate-950 rounded-full select-none";
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  paginationContainer.appendChild(pageIndicator);

  const nextBtn = document.createElement("button");
  nextBtn.className =
    "w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-slate-950 transition-all duration-200 flex items-center justify-center cursor-pointer border-none outline-none disabled:opacity-40 disabled:cursor-not-allowed";
  nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right text-xs"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPaginatedRecipes();
      window.scrollTo({
        top: recipeContainer.offsetTop - 120,
        behavior: "smooth",
      });
    }
  });
  paginationContainer.appendChild(nextBtn);
}

function handleSearch() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    fetchRecipes(searchTerm);
    recomText.style.display = "none";
    searchText.innerHTML = `
            <h2 class="text-xl md:text-2xl font-serif font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-magnifying-glass text-amber-500 text-lg"></i>
                <span>Results for "${searchTerm}"</span>
            </h2>
        `;
    selectedFilter = null;
    renderSidebarFilters();
  }
}

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

async function fetchRecipes(query) {
  showSkeletons();
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    recipeContainer.innerHTML = "";

    if (data.meals) {
      currentRecipes = data.meals;
      currentPage = 1;
      renderPaginatedRecipes();
    } else {
      currentRecipes = [];
      renderPaginatedRecipes();
    }
  } catch (error) {
    console.error(error);
    showErrorState("fetchRecipes", query);
  }
}

async function openRecipeModal(id) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    );
    const data = await response.json();
    const meal = data.meals[0];

    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredientsList += `
                    <li class="flex items-start gap-2.5 text-slate-600 dark:text-slate-400 text-sm py-1 group select-none">
                        <span class="w-5 h-5 rounded-md border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/20 flex items-center justify-center text-amber-650 dark:text-amber-500 shrink-0 text-[10px] group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-colors duration-200">
                            <i class="fa-solid fa-check"></i>
                        </span>
                        <span><strong class="text-slate-800 dark:text-slate-200 font-semibold">${measure ? measure.trim() + " " : ""}</strong>${ingredient.trim()}</span>
                    </li>
                `;
      }
    }

    recipeDetailsContent.innerHTML = `
            <div class="md:w-1/2 relative bg-slate-900 min-h-[350px] md:min-h-0 flex flex-col justify-end border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-65">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div class="relative p-6 md:p-8 text-white z-10">
                    <span class="inline-block px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full uppercase tracking-wider mb-3.5 shadow-sm">${meal.strCategory || "Recipe"}</span>
                    <h2 class="text-3xl md:text-4xl font-serif font-bold leading-tight mb-3 text-white">${meal.strMeal}</h2>
                    <p class="text-slate-350 text-xs flex items-center gap-1.5 mb-6">
                        <i class="fa-solid fa-globe text-amber-400"></i> ${meal.strArea || "International"} Cuisine
                    </p>
                    ${
                      meal.strYoutube
                        ? `
                        <a href="${meal.strYoutube}" target="_blank" class="inline-flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer">
                            <i class="fa-brands fa-youtube text-base"></i>
                            <span>Watch YouTube Tutorial</span>
                        </a>
                    `
                        : ""
                    }
                </div>
            </div>
            
            <div class="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col h-full scrollbar-none">
                <div class="mb-6">
                    <h3 class="text-base font-serif font-bold text-slate-855 dark:text-slate-200 mb-3.5 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
                        <i class="fa-solid fa-carrot text-amber-500"></i>
                        <span>Ingredients Checklist</span>
                    </h3>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        ${ingredientsList}
                    </ul>
                </div>
                
                <div class="border-t border-slate-100 dark:border-slate-800 pt-6">
                    <h3 class="text-base font-serif font-bold text-slate-855 dark:text-slate-200 mb-3.5 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
                        <i class="fa-solid fa-list-check text-amber-500"></i>
                        <span>Preparation Instructions</span>
                    </h3>
                    <div class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                        ${meal.strInstructions.split("\r\n\r\n").join("\n\n")}
                    </div>
                </div>
            </div>
        `;

    openModal();
  } catch (error) {
    console.error(error);
  }
}

function addMealToDOM(recipe) {
  const cardSubtitle = recipe.strArea
    ? `${recipe.strCategory || "Recipe"} &bull; ${recipe.strArea}`
    : `${recipe.strCategory || "Recipe"}`;

  const cardEl = document.createElement("div");
  cardEl.className =
    "card group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-amber-200/50 dark:hover:border-amber-900/50 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer relative w-full max-w-lg";
  cardEl.setAttribute("data-id", recipe.idMeal);

  cardEl.innerHTML = `
        <div class="relative overflow-hidden flex-grow h-0 bg-slate-100 dark:bg-slate-800">
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-75 group-hover:opacity-100">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-white text-xs font-semibold flex items-center gap-1 shadow-sm">
                    <i class="fa-solid fa-utensils text-amber-400"></i> Open Recipe
                </span>
            </div>
        </div>
        <div class="p-5 flex flex-col shrink-0">
            <span class="inline-block text-[10px] font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase mb-1.5">${cardSubtitle}</span>
            <h3 class="font-sans text-base font-bold text-slate-855 dark:text-slate-200 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200 mb-2">${recipe.strMeal}</h3>
            <button class="view-btn mt-auto w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border-none outline-none">
                <span>View Recipe</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
        </div>
    `;

  cardEl.addEventListener("click", () => {
    openRecipeModal(recipe.idMeal);
  });

  const viewBtn = cardEl.querySelector(".view-btn");
  viewBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openRecipeModal(recipe.idMeal);
  });

  recipeContainer.appendChild(cardEl);
}

async function fetchFavMeals() {
  showSkeletons();
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=",
    );
    const data = await response.json();
    recipeContainer.innerHTML = "";
    if (data.meals) {
      const shuffled = [...data.meals].sort(() => 0.5 - Math.random());
      currentRecipes = shuffled;
      currentPage = 1;
      renderPaginatedRecipes();
    } else {
      currentRecipes = [];
      renderPaginatedRecipes();
    }
  } catch (error) {
    console.error(error);
    showErrorState("fetchFavMeals");
  }
}

async function filterRecipes(param, value) {
  showSkeletons();
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?${param}=${encodeURIComponent(value)}`,
    );
    const data = await response.json();
    recipeContainer.innerHTML = "";

    if (data.meals) {
      data.meals.forEach((meal) => {
        meal.strCategory = value;
      });
      currentRecipes = data.meals;
      currentPage = 1;
      renderPaginatedRecipes();
    } else {
      currentRecipes = [];
      renderPaginatedRecipes();
    }
  } catch (error) {
    console.error(error);
    showErrorState("filterRecipes", { param, value });
  }
}

renderSidebarFilters();
fetchFavMeals();
