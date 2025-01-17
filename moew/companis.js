const companies = [
  {
    networkId: "142877",
    networkName: "Shudder",
    logoLink:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Shudder_2017.svg",
    networkType: "movie",
  },
  {
    networkId: "213",
    networkName: "Netflix",
    logoLink:
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
    networkType: "tv",
  },
  {
    networkId: "521",
    networkName: "DreamWorks Animation",
    logoLink:
      "https://seeklogo.com/images/D/dreamworks-animation-logo-E627C12B3A-seeklogo.com.png",
    networkType: "movie",
  },
  {
    networkId: "420",
    networkName: "Marvel Studios",
    logoLink:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Marvel_Studios_2016_logo.svg",
    networkType: "movie",
  },
  {
    networkId: "6219",
    networkName: "MGM+",
    logoLink:
      "https://upload.wikimedia.org/wikipedia/commons/4/49/MGM%2B_logo.svg",
    networkType: "tv",
  },

  {
    networkId: "2552",
    networkName: "Apple TV+",
    logoLink:
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg",
    networkType: "tv",
  },
  {
    networkId: "3353",
    networkName: "Peacock",
    logoLink:
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg",
    networkType: "tv",
  },
];

async function companiesLoop() {
  for (const company of companies) {
    await fetchCompanies(
      company.networkId,
      company.networkName,
      company.logoLink,
      company.networkType
    );
  }
  tamad();
}

async function fetchCompanies(
  networkId,
  networkName,
  networkLogoLink,
  networkType
) {
  const endpoint = `https://api.themoviedb.org/3/discover/${networkType}?api_key=${apiKey}&${
    networkType === "movie" ? "with_companies" : "with_networks"
  }=${networkId}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Error fetching network data");
    }
    const data = await response.json();

    const series = await Promise.all(
      data.results.map(async (seriesItem) => {
        const englishBackdropUrl = await fetchImages(
          seriesItem.id,
          networkType,
          "englishBackdrop"
        );

        return {
          id: seriesItem.id,
          overview: seriesItem.overview,
          posterUrl: `https://image.tmdb.org/t/p/w500/${seriesItem.poster_path}`,
          name: seriesItem.name || seriesItem.title,
          backdropUrl: englishBackdropUrl,
          mediaType: networkType,
          vote_average: seriesItem.vote_average,
          date:
            (seriesItem.release_date || seriesItem.first_air_date)?.split("-")[0] || "Unknown",
        };
      })
    );

    displayCompanies(
      networkId,
      networkName,
      networkLogoLink,
      networkType,
      series
    );
  } catch (error) {
    console.error(error);
  }
}

function displayCompanies(
  networkId,
  networkName,
  logoLink,
  networkType,
  series
) {
  const companiesContainer = document.getElementById("companiesContainer");
  const networkSection = document.createElement("div");
  networkSection.classList.add("networkSection");

  const logoImg = document.createElement("img");
  logoImg.className = "logoCompanyImg";
  logoImg.dataset.src = logoLink;
  logoImg.alt = "Network Logo";
  logoImg.classList.add("lazy-load");

  // Create Swiper container
  const swiperContainer = document.createElement("div");
  swiperContainer.className = "swiperContainer";
  swiperContainer.classList.add("swiper-container");
  swiperContainer.id = `swiper-${networkId}`;

  const swiperWrapper = document.createElement("div");
  swiperWrapper.classList.add("swiper-wrapper");

  series.forEach((seriesItem) => {
    if (!seriesItem.vote_average == "0") {
      const swiperSlide = document.createElement("div");
      swiperSlide.className = "companySlide swiper-slide";
      const tooltipId = `movieDetails-${seriesItem.id}`;
      swiperSlide.innerHTML = `
    <img 
      class="backdropImg lazy-load" 
      data-src="${seriesItem.posterUrl}" 
      alt="${seriesItem.name}" 
    />

    <div class="companyCardTitleContainer">
      <p class="companyCardTitle">${seriesItem.name}</p>
      <p>${seriesItem.date}</p>
    </div>
    

    <div class="movie-tooltip" id="${tooltipId}">
    <div class="movie-tooltip-content">
    <img class="movie-tooltip-image lazy-load" data-src="${seriesItem.backdropUrl}"/>  
   <p class="movie-tooltip-title">${seriesItem.name} (${seriesItem.date})</p>
   <p class="movie-tooltip-rating">TMDB Rating: <span class="material-symbols-rounded">
star
</span>${seriesItem.vote_average}</p>
    <p class="movie-tooltip-overview">${seriesItem.overview}</p>
    <p class="movie-tooltip-button"><span style="color: black" class="material-symbols-rounded">
play_arrow
</span>Play Now</p>
    </div>
     </div>
    `;

      const movieDetails = swiperSlide.querySelector(`#${tooltipId}`);

      // Initialize Popper.js for positioning the tooltip
      const popperInstance = Popper.createPopper(swiperSlide, movieDetails, {
        placement: "top", // Position the tooltip above the card
      });

      swiperSlide.addEventListener("mouseenter", () => {
        movieDetails.classList.add("visible");
        popperInstance.update(); // Update position of the tooltip
      });

      swiperSlide.addEventListener("mouseleave", () => {
        movieDetails.classList.remove("visible");
      });

      swiperWrapper.appendChild(swiperSlide);

      const tooltipButton = swiperSlide.querySelector(".movie-tooltip-button");
      tooltipButton.addEventListener("click", () => {
        iframePlayer.classList.add("iframePlayerActive");
        sourcePlayer(seriesItem.id, networkType, "1", "1");
      });

      const backdropImg = swiperSlide.querySelector(".backdropImg");
      backdropImg.addEventListener("click", () => {
        modalFunction(seriesItem); // Ensure modalFunction() is defined elsewhere
      });
    }
  });

  swiperContainer.appendChild(swiperWrapper);
  networkSection.appendChild(logoImg);
  networkSection.appendChild(swiperContainer);
  companiesContainer.appendChild(networkSection);

  // Initialize Swiper
  new Swiper(`#swiper-${networkId}`, {
    slidesPerView: "auto",
    spaceBetween: 15,
    loop: true,
    freeMode: true,
    pagination: {
      el: `.swiper-pagination-${networkId}`,
      clickable: true,
    },
  });
}
