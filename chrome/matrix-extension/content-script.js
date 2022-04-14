const issuesFiltersDiv = document.querySelectorAll(".issues-filters")[0];

const buildDropdown = function(dropdownItems) {
  const dropdownTag = document.createElement("select");
  dropdownTag.className = "mr-2";
  dropdownTag.setAttribute("id", "milestoneSelect");

  dropdownItems.forEach(function (dropdownItem) {
    const optionTag = document.createElement("option");
    optionTag.innerText = dropdownItem.itemText;
    optionTag.setAttribute('value', dropdownItem.itemLink);
    if (dropdownItem.selected) {
      optionTag.setAttribute('selected', true);
    }
    dropdownTag.appendChild(optionTag);
  });

  return dropdownTag;
};

const getCurrentMilestone = function() {
  const currentURL = new URL(window.location.href);
  return currentURL.searchParams.get('milestone_title');
}

const calculatedMilestoneHref = function(milestoneTitle) {
  const currentURL = new URL(window.location.href);

  currentURL.searchParams.delete('milestone_title');
  currentURL.searchParams.append('milestone_title', milestoneTitle);

  return currentURL.toString();
};

const allProjectLabels = [
  "主线改版",
  "移动端增长",
  "质量部"
]

const allLabelKeys = [
  "not[label_name][]",
  "label_name[]"
]

const calculatedLabelHref = function(labelValues, matcher) {
  const currentURL = new URL(window.location.href);

  const searchParamKeyValuesToKeep = {};
  currentURL.searchParams.forEach(function ([key, value]) {
    if (!(allLabelKeys.includes(key) && allProjectLabels.includes(value))) {
      searchParamKeyValuesToKeep[key] = value;
    }
  });

  Array.from(currentURL.searchParams.keys()).forEach(function(key) {
    currentURL.searchParams.delete(key);
  });


  Object.entries(searchParamKeyValuesToKeep).forEach(function([key, value]) {
    currentURL.searchParams.append(key, value);
  });

  const key = matcher === "not" ? "not[label_name][]" : "label_name[]";

  labelValues.forEach(function (labelValue) {
    currentURL.searchParams.append(key, labelValue);
  });

  return currentURL.toString();
};

// Init SuperFilters
const superFiltersDiv = document.createElement("div");
superFiltersDiv.style = "border-top: 0;";
superFiltersDiv.className = "row-content-block";

const currentMilestone = getCurrentMilestone();

// Milestone links
superFiltersDiv.innerHTML += "<span class=\"mr-1 p-1 pl-2 pr-2 badge bg-warning text-white\">Milestone</span>";

const milestoneTitles = [
  ["BIG199: FEB28 - MAR06"],
  ["BIG200: MAR07 - MAR13"],
  ["BIG201: MAR14 - MAR20"],
  ["BIG202: MAR21 - MAR27"],
  ["BIG203: MAR28 - APR03"],
  ["BIG204: APR04 - APR10"],
  ["BIG205: APR11 - APR17"],
  ["BIG206: APR18 - APR24"],
  ["BIG207: APR25 - MAY01"]
];

const milestoneDropdownItems = milestoneTitles.map(function ([milestoneTitle]) {
  return {
    itemText: milestoneTitle,
    itemLink: calculatedMilestoneHref(milestoneTitle),
    selected: (milestoneTitle === currentMilestone)
  };
});

const dropdownTag = buildDropdown(milestoneDropdownItems);
superFiltersDiv.appendChild(dropdownTag);

// Project links
superFiltersDiv.innerHTML += "<span class=\"mr-1 p-1 pl-2 pr-2 badge bg-warning text-white\">Project</span>";

const projects = [
  ["产品迭代", ["主线改版", "移动端增长"], 'not'],
  ["主线改版", ["主线改版"]],
  ["移动端增长", ["移动端增长"]],
  ["质量部", ["质量部"]]
]

projects.forEach(function ([projectName, labelValues, matcher]) {
  const href = calculatedLabelHref(labelValues, matcher);
  const linkTag = document.createElement("a");
  linkTag.innerText = projectName;
  linkTag.href = href;
  linkTag.className = "mr-2";
  superFiltersDiv.appendChild(linkTag);
});

// Insert SuperFilters
issuesFiltersDiv.appendChild(superFiltersDiv);

document.querySelector('#milestoneSelect').addEventListener('change', function (e) {
  const url = e.target.value;
  window.location.replace(url);
});
