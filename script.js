/*-------------------------------------*/
/*            Fetch URLs               */
/*-------------------------------------*/
console.log("script loaded");
let englishURL =
  "https://zinrec.intervieweb.it/annunci.php?lang=en&LAC=erqole&d=miramis.com&k=603e695eadef987e4321536bd158a881&CodP=&format=json_en&utype=0";
let italianURL =
  "https://zinrec.intervieweb.it/annunci.php?lang=it&LAC=erqole&d=miramis.com&k=603e695eadef987e4321536bd158a881&CodP=&format=json_en&utype=0";

/*-------------------------------------*/
/*            Variables                */
/*-------------------------------------*/

// Editable Variables
let sectionID = "jobs-section";
let filterContainerIdentifier = "#department-filter-dropdown";
let brandFilterContainerIdentifier = "#brand-filter-dropdown";
let jobContainerID = "job-container";
let jobItem = ".job-item";
let filterIdentifier = "[data-filter]";
let resetIdentifier = "[data-filter='reset']";
let activeIdentifier = "active";

// Functional Variables
let currentPath = window.location.pathname;
let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
let jobsArray = [];
let language;

//Temp Variables
var brandFilter = "";
var functionFilter = "";
var activeFilters;
var TorreImage =
  "https://cdn.prod.website-files.com/671a1cb360117ed1b3e3d64a/675336a8807760535c59753f_Torre%20Cala%20Icon.svg";
var MiramisImage =
  "https://cdn.prod.website-files.com/671a1cb360117ed1b3e3d64a/67534780d64e7e95acc6b563_Miramis%20Icon.svg";
var LaRoqqaImage =
  "https://cdn.prod.website-files.com/671a1cb360117ed1b3e3d64a/675348f19debe3c74c872d24_La%20Roqqa%20icon.svg";

/*-------------------------------------*/
/*        Drop Down Functions          */
/*-------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const dropdowns = [
    {
      trigger: document.querySelector("#brand-trigger"),
      content: document.querySelector("#brand-filter-dropdown"),
    },
    {
      trigger: document.querySelector("#department-trigger"),
      content: document.querySelector("#department-filter-dropdown"),
    },
  ];

  // Hide all dropdowns initially
  dropdowns.forEach((dropdown) => {
    dropdown.content.classList.add("hide");
  });

  // Add click handlers for triggers
  dropdowns.forEach((dropdown) => {
    dropdown.trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      // Hide all other dropdowns
      dropdowns.forEach((d) => {
        if (d !== dropdown) {
          d.content.classList.add("hide");
        }
      });
      // Toggle current dropdown
      dropdown.content.classList.toggle("hide");
    });

    // Prevent clicks inside dropdown from closing it
    dropdown.content.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function () {
    dropdowns.forEach((dropdown) => {
      dropdown.content.classList.add("hide");
    });
  });
});

/*-------------------------------------*/
/*            Fetch Job                */
/*-------------------------------------*/

function fetchJobs(url) {
  showJobPreLoader();
  hideEmptyState();
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const jobList = document.getElementById(jobContainerID);
      jobList.innerHTML = "";
      jobsArray = data;
      data.forEach((job) => {
        let title = job.title;
        let drawerID = "job-drawer-" + job.id;
        let slug = job.slug;
        let image = getImage(job.project_label);
        let brand = formatCompany(job.project_label);
        let fullDescription = formatLongDescription(job.description);
        let shortDescription = formatShortDescription(job.position_description);
        let date = formatDate(job.published);

        // Create job element
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-item");
        jobItem.id = "job-item-" + job.id;
        jobItem.innerHTML = `
<!--html-->
<div class="job-listing" onclick="openJobDrawer('${drawerID}', '${slug}')">
  <div class="listing_logo">
    <div class="listing_image">
      <img class="brand-logo" src="${image}" loading="eager" class="image">
    </div>
  </div>
  <div class="listing_content">
    <div class="table_brand">
        <p id="job-brand" class="text-style-label">${brand}</p>
    </div>
    <div class="table_title">
        <p id="job-title" class="heading-style-h3">${title}</p>
    </div>
    <div class="table_function">
        <p id="job-location" class="text-size-small">${job.location}</p>
        <div class="table_dot"></div>
        <p id="job-type" class="text-size-small">${job.contract_type}</p>
    </div>
  </div>
  <div class="listing_function">
    <p id="job-function" class="text-style-label">${job.function}</p>
  </div>
  <div class="time-posted">
    <p class="text-size-small text-color-grey">${date}</p>
  </div>
  <!-- <div class="details">
      <div id="job-date" class="text-style-label text-color-grey">${date}</div>
  </div> -->
  <!-- <div class="description">
      <p id="job-description" class="text-color-dark-grey text-style-3lines">${shortDescription}</p>
  </div> -->
  <!-- <div id="btn-open-drawer" class="button_primary">
      <div class="text-style-label">Read more</div>
  </div> -->
</div>

<div id="${drawerID}" class="job_drawer" data-slug="${slug}">
  <div class="job_wrapper">
    <div class="drawer_menu">
      <a href="#" class="button_primary w-inline-block" onclick="closeJobDrawer('${drawerID}')">
          <div class="text-style-label">Close</div>
      </a>
      <div class="drawer_logo">
        <div class="navbar_logo">
          <svg width="100%" height="100%" viewBox="0 0 21 48" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M0.663086 48L3.40441 22.7368H6.30698L9.0483 48H0.663086Z" fill="CurrentColor" />
                <path d="M11.9512 48L14.6925 22.7368H17.5951L20.3364 48H11.9512Z" fill="CurrentColor" />
                <path d="M9.0089 22.7368L6.26758 0H14.6528L11.9115 22.7368H9.0089Z" fill="CurrentColor" />
            </svg>
        </div>
      </div>
      <div class="job-preview_button-wrapper"><a href="${job.url}" class="button_primary w-inline-block">
              <div class="text-style-label">Apply now</div>
          </a>
      </div>
    </div>
<div class="padding-global padding-section-large">
  <div class="job_layout">
      <div class="job_title">
          <h2 class="heading-style-h1">${title}</h2>
<!--           <p>
              ${shortDescription}
          </p> -->
          <div class="job-preview_tags">
              <p class="text-style-label">${job.project_label}</p>
              <p class="text-style-label">${date}</p>
          </div>
      </div>
      <div class="image_wrapper"><img src="${job.coverImage}" alt="" loading="eager" class="image"></div>
      <div class="container-small text-rich-text">
          ${fullDescription}
      </div>
      <div id="job-iframe" class="job-application-iframe w-embed w-iframe"><iframe
              src="${job.registration_iframe_url}" width="100%" height="600" frameborder="0"
              allowfullscreen=""></iframe></div>
  </div>
</div>
<div class="job_apply-footer">
  <div class="job-preview_button-wrapper"><a href="${job.url}"
          class="button_primary is-alternate w-inline-block">
          <div class="text-style-label">Apply now</div>
      </a>
  </div>
</div>
</div>
  <div class="job_close-area" onclick="closeJobDrawer('${drawerID}')"></div>
</div>
<!--!html-->
                `;
        jobList.appendChild(jobItem);
      });
      hideJobPreLoader();
      initFilters(jobsArray);
      checkUrlForDrawer();
    })
    .catch((error) => {
      console.error("Error:", error);
      hideJobPreLoader();
      showEmptyState();
    });
}

/*-------------------------------------*/
/*            Filter Jobs              */
/*-------------------------------------*/

class JobFilter {
  constructor() {
    this.jobList = document.querySelectorAll(jobItem);
    this.filters = {};
  }

  setFilter(filterName, filterFunction) {
    this.filters[filterName] = filterFunction;
    this.applyFilters();
  }

  removeFilter(filterName) {
    delete this.filters[filterName];
    this.applyFilters();
  }

  applyFilters() {
    let hiddenCount = 0;
    let visibleCount = 0;

    this.jobList.forEach((item) => {
      const shouldShow = Object.values(this.filters).every((filterFn) =>
        filterFn(item)
      );
      if (shouldShow) {
        visibleCount++;
      } else {
        hiddenCount++;
      }
      item.style.display = shouldShow ? "" : "none";
    });

    if (hiddenCount === this.jobList.length) {
      console.log("Set:", activeFilters);
      console.log("No jobs match the current filters");
      console.log(
        "Active filters:",
        Array.from(activeFilters).map(
          (btn) => `${btn.dataset.filter}:${btn.dataset.value}`
        )
      );
      let tempArray = Array.from(activeFilters).map(function (btn) {
        if (btn.dataset.filter === "project_label") {
          brandFilter = btn.dataset.value;
          console.log("Brand:", btn.dataset.value);
        } else {
          functionFilter = btn.dataset.value;
          console.log("Function:", btn.dataset.value);
        }
      });

      showEmptyState();
    } else {
      hideEmptyState();
    }

    console.log(
      `Filter results: ${visibleCount} visible, ${hiddenCount} hidden (Total: ${this.jobList.length})`
    );
  }

  showLatestJobs() {
    // Convert NodeList to Array for easier manipulation
    const jobArray = Array.from(this.jobList);

    // Show all jobs first
    jobArray.forEach((job) => (job.style.display = ""));

    if (jobArray.length <= 6) {
      return; // If 6 or fewer jobs, show all of them
    }

    // Sort jobs by date (newest first)
    const sortedJobs = jobArray.sort((a, b) => {
      const dateA = new Date(a.querySelector(".time-posted p").textContent);
      const dateB = new Date(b.querySelector(".time-posted p").textContent);
      return dateB - dateA;
    });

    // Hide all except the first 6
    sortedJobs.forEach((job, index) => {
      if (index >= 6) {
        job.style.display = "none";
      }
    });
  }
}

function initFilters(data) {
  const functionSet = new Set();
  const brandSet = new Set();

  data.forEach((job) => {
    functionSet.add(job.function);
    brandSet.add(job.project_label);
  });

  showFilters(filterContainerIdentifier, functionSet, "function");
  showFilters(brandFilterContainerIdentifier, brandSet, "project_label");

  let resetFilters = document.querySelector(".reset-filters");
  resetFilters.innerHTML = "";
  createButton("reset", "Show All", "Show All", ".reset-filters");
  initializeFilterButtons();
}

function showFilters(containerIdentifier, filterSet, filterType) {
  const target = document.querySelector(containerIdentifier);
  target.innerHTML = "";

  filterSet.forEach((filterValue) => {
    createButton(filterType, filterValue, filterValue, containerIdentifier);
  });
}

function createButton(
  filterType,
  filterValue,
  buttonText,
  containerIdentifier = filterContainerIdentifier
) {
  const buttonWrapper = document.createElement("div");
  const button = buttonWrapper.appendChild(document.createElement("button"));
  button.dataset.filter = filterType;
  button.dataset.value = filterValue;
  button.classList.add("text-style-label");
  button.classList.add("filter-button");
  let brand = formatCompany(buttonText);
  button.textContent = brand;

  const filterContainer = document.querySelector(containerIdentifier);
  filterContainer.insertBefore(buttonWrapper, filterContainer.firstChild);

  return button;
}

function initializeFilterButtons() {
  const jobFilter = new JobFilter();

  const filterButtons = document.querySelectorAll(filterIdentifier);
  const clearButton = document.querySelector(resetIdentifier);
  clearButton.parentElement.classList.add(activeIdentifier);

  // Add references to filter labels
  const brandLabel = document.getElementById("filter-label-brand");
  const functionLabel = document.getElementById("filter-label-function");

  activeFilters = new Set();

  // Hide filter labels initially
  brandLabel.style.display = "none";
  functionLabel.style.display = "none";

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Close all dropdowns when filter is clicked
      document
        .querySelectorAll("#brand-filter-dropdown, #department-filter-dropdown")
        .forEach((dropdown) => {
          dropdown.classList.add("hide");
        });

      const filterType = button.dataset.filter;
      const filterValue = button.dataset.value;
      clearButton.parentElement.classList.remove(activeIdentifier);

      if (activeFilters.has(button)) {
        activeFilters.delete(button);
        button.parentElement.classList.remove(activeIdentifier);
        jobFilter.removeFilter(filterType);

        // Hide corresponding label
        if (filterType === "project_label") {
          brandLabel.style.display = "none";
        } else if (filterType === "function") {
          functionLabel.style.display = "none";
        }
      } else {
        filterButtons.forEach((btn) => {
          if (btn.dataset.filter === filterType && activeFilters.has(btn)) {
            activeFilters.delete(btn);
            btn.parentElement.classList.remove(activeIdentifier);
          }
        });

        activeFilters.add(button);
        button.parentElement.classList.add(activeIdentifier);

        // Update and show corresponding label
        if (filterType === "project_label") {
          let brand = formatCompany(filterValue);
          brandLabel.querySelector(".text-style-label").textContent = brand;
          brandLabel.style.display = "flex";
        } else if (filterType === "function") {
          functionLabel.querySelector(".text-style-label").textContent =
            filterValue;
          functionLabel.style.display = "flex";
        }

        jobFilter.setFilter(filterType, (item) => {
          const jobId = item.id.split("-").pop();
          const matchingJob = jobsArray.find(
            (job) => job.id.toString() === jobId
          );
          return matchingJob && matchingJob[filterType] === filterValue;
        });
      }
    });
  });

  // Add click handlers for remove filter buttons
  document.querySelectorAll(".remove-filter").forEach((button) => {
    button.addEventListener("click", (e) => {
      const labelContainer = e.target.closest(".filter_label");
      const filterType = labelContainer.classList.contains("brand")
        ? "project_label"
        : "function";

      // Find and click the corresponding filter button to remove the filter
      filterButtons.forEach((btn) => {
        if (btn.dataset.filter === filterType && activeFilters.has(btn)) {
          btn.click();
        }
      });
    });
  });

  clearButton?.addEventListener("click", () => {
    activeFilters.clear();
    filterButtons.forEach((btn) =>
      btn.parentElement.classList.remove(activeIdentifier)
    );
    Object.keys(jobFilter.filters).forEach((filter) => {
      jobFilter.removeFilter(filter);
    });
    clearButton.parentElement.classList.add(activeIdentifier);

    // Hide both labels
    brandLabel.style.display = "none";
    functionLabel.style.display = "none";

    console.log("Active filters: none");
  });

  // Clear existing filters
  clearButton.click();
  // Show latest jobs
  jobFilter.showLatestJobs();
}

/*-------------------------------------*/
/*        Event Listeners              */
/*-------------------------------------*/

document.addEventListener("DOMContentLoaded", () => {
  enableScroll();
  Weglot.on("initialized", () => {
    language = Weglot.getCurrentLang();
    if (language === "it") {
      fetchJobs(italianURL);
    } else {
      fetchJobs(englishURL);
    }
  });
  Weglot.on("languageChanged", function (newLang, prevLang) {
    if (newLang === "it") {
      fetchJobs(italianURL);
    } else {
      fetchJobs(englishURL);
    }
  });
});

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.drawerId) {
    const drawerSlug = document.getElementById(event.state.drawerId)?.dataset
      .slug;
    if (drawerSlug) {
      openJobDrawer(event.state.drawerId, drawerSlug);
    } else {
      console.warn("Drawer slug not found for drawerId:", event.state.drawerId);
      enableScroll();
    }
  } else {
    document.querySelectorAll(".job_drawer.active").forEach((drawer) => {
      drawer.classList.remove(activeIdentifier);
    });
    enableScroll();
  }
});

/*-------------------------------------*/
/*        Job Drawer Functions         */
/*-------------------------------------*/

function openJobDrawer(id, drawerSlug) {
  if (!id || !drawerSlug) {
    console.error("Invalid parameters for openJobDrawer:", id, drawerSlug);
    return;
  }

  let jobDrawer = document.getElementById(id);
  if (jobDrawer) {
    disableScroll();
    jobDrawer.classList.add(activeIdentifier);
    history.pushState({ drawerId: id }, "", `${currentPath}#${drawerSlug}`);

    setTimeout(() => {
      jobDrawer.focus();
      jobDrawer.setAttribute("tabindex", "-1");
    }, 100);
  } else {
    console.warn("Job drawer not found for id:", id);
  }
}

function closeJobDrawer(id) {
  let jobDrawer = document.getElementById(id);
  jobDrawer.classList.remove(activeIdentifier);
  history.pushState({}, "", currentPath);
  enableScroll();
}

function checkUrlForDrawer() {
  const pathParts = window.location.href.split("#");
  const drawerSlug = pathParts[pathParts.length - 1];
  const jobDrawer = document.querySelector(
    `.job_drawer[data-slug="${drawerSlug}"]`
  );

  if (jobDrawer) {
    const drawerId = jobDrawer.id;
    openJobDrawer(drawerId, drawerSlug);
    document.getElementById(sectionID).scrollIntoView();
  }
}

/*-------------------------------------*/
/*        Utility Functions            */
/*-------------------------------------*/

function disableScroll() {
  document.body.classList.add("disable-scroll");
  document.body.style.paddingRight = scrollbarWidth + "px";
}

function enableScroll() {
  document.body.classList.remove("disable-scroll");
  document.body.style.paddingRight = "0";
}

function hideJobPreLoader() {
  document.getElementById("job-loader").classList.add("hidden");
}

function showJobPreLoader() {
  document.getElementById("job-loader").classList.remove("hidden");
}

function formatLongDescription(description) {
  description = description.replace(/<br \/>/g, "");
  description = description.replace(/<br\/>/g, "");
  description = description.replace(/<p><\/p>/g, "");
  description = description.replace(/<h2>/g, "<h3>");
  description = description.replace(/<\/h2>/g, "</h3>");
  return description;
}

function getImage(company) {
  if (company === "Boutique Hotel Torre di Cala Piccola") {
    return TorreImage;
  } else if (company === "La Roqqa Hotel") {
    return LaRoqqaImage;
  } else {
    return MiramisImage;
  }
}

function formatCompany(company) {
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = company;
  let formattedCompany = tempDiv.textContent.replace(
    "Boutique Hotel Torre di Cala Piccola",
    "Torre di Cala Piccola"
  );
  return formattedCompany;
}

function formatShortDescription(description) {
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = description;
  let firstPTag = tempDiv.querySelector("p");
  //"JOIN OUR COMMUNITY",
  let shortDescription = firstPTag
    ? firstPTag.textContent
        .replace("JOIN OUR COMMUNITY,", "Join our community")
        .replace(`"JOIN OUR COMMUNITY"`, "Join our community")
        .replace(`:`, "...")
    : "";
  return shortDescription;
}

function formatDate(date) {
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = date;
  let dateParts = tempDiv.textContent.split(" ")[0].split("-");
  let dateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

  // Calculate days difference
  const now = new Date();
  const diffTime = Math.abs(now - dateObject);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Format the relative time
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return `${diffDays} days ago`;
  }
}

function hideEmptyState() {
  document.querySelector(".empty_filters").classList.add("hide");
}

function showEmptyState() {
  document.querySelector(".empty_filters").classList.remove("hide");
  document.querySelector(".empty_filters p").textContent =
    brandFilter + " has no " + functionFilter + " jobs listed";
}
