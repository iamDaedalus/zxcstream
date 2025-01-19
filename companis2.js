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
    networkId: "174",
    networkName: "AMC",
    logoLink:
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Amc_logo.svg",
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
  const companiesContainer = document.getElementById("companiesContainer");

  for (const company of companies) {
    const networkSection = document.createElement("div");
    networkSection.className = "networkSection";

    // const companyLogo = document.createElement("img");
    // companyLogo.className = "logoCompanyImg";
    // companyLogo.classList.add("lazy-load");
    // companyLogo.dataset.src = company.logoLink;
    // companyLogo.alt = company.networkName || company.networkName;

    const companyTitle = document.createElement("h1");
    companyTitle.className = "companyTitle";
    companyTitle.innerText = company.networkName;

    networkSection.appendChild(companyTitle);
    companiesContainer.appendChild(networkSection);

    const arf = await fetchCompanies(company.networkId, company.networkType);

    const swiperContainer = document.createElement("div");
    swiperContainer.className = "swiperContainer";

    const swiperWrapper = document.createElement("div");
    swiperWrapper.classList.add("swiper-wrapper");

    arf.results.forEach((meow) => {
      if (meow.vote_average != 0) {
        const swiperSlide = document.createElement("div");
        swiperSlide.className = "companySlide swiper-slide";

        swiperSlide.innerHTML = `
      <img class="backdropImg lazy-load" data-src="https://image.tmdb.org/t/p/w500/${
        meow.poster_path
      }"/>

       <div class="companyCardTitleContainer">
      <p class="companyCardTitle">${meow.name || meow.title}</p>
      <p>${(meow.release_date || meow.first_air_date)?.split("-")[0]}</p>
    </div>

    <div class="movie-tooltip" id="movie-tooltip">
    <div class="movie-tooltip-content"> 
     <img  class="movie-tooltip-image lazy-load" data-src="https://image.tmdb.org/t/p/w500/${
       meow.backdrop_path
     }"/>
   <p class="movie-tooltip-title">${meow.name || meow.title} (${
          (meow.release_date || meow.first_air_date)?.split("-")[0]
        })</p>
   <p class="movie-tooltip-rating">TMDB Rating: <span class="material-symbols-rounded">
star
</span>${meow.vote_average}</p>
    <p class="movie-tooltip-overview">${meow.overview}</p>
    <p class="movie-tooltip-button"><span style="color: black" class="material-symbols-rounded">
play_arrow
</span>Play Now</p>
    </div>
     </div>
      `;

        const movieDetails = swiperSlide.querySelector(".movie-tooltip");

        const popperInstance = Popper.createPopper(swiperSlide, movieDetails, {
          placement: "top", // Position the tooltip above the card
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport", // Prevents dropdowns from exceeding boundaries
              },
            },
            {
              name: "eventListeners",
              options: {
                scroll: false, // Disable scroll event updates
                resize: true, // Allow resize updates
              },
            },
          ],
        });

        swiperSlide.addEventListener("mouseenter", () => {
          movieDetails.classList.add("visible");
          popperInstance.update(); // Update position of the tooltip
        });

        swiperSlide.addEventListener("mouseleave", () => {
          movieDetails.classList.remove("visible");
        });

        swiperWrapper.appendChild(swiperSlide);

        const tooltipButton = swiperSlide.querySelector(
          ".movie-tooltip-button"
        );
        tooltipButton.addEventListener("click", () => {
          iframePlayer.classList.add("iframePlayerActive");
          sourcePlayer(meow.id, company.networkType, "1", "1");
        });

        const backdropImg = swiperSlide.querySelector(".backdropImg");
        backdropImg.addEventListener("click", async () => {
          modal.classList.add("active");
          const meoww = await fetchShows(meow.id, company.networkType);
          modalFunction(meoww);
        });
      }
    });

    swiperContainer.appendChild(swiperWrapper);
    networkSection.appendChild(swiperContainer);

    new Swiper(swiperContainer, {
      slidesPerView: "auto",
      spaceBetween: 15,
      // grid: {
      //   rows: 2, // Number of rows
      //   fill: "row", // Direction to fill slides ('row' or 'column')
      // },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        768: {
          // For tablets
          slidesPerView: 4,
          spaceBetween: 12,
        },
        1024: {
          // For desktops
          slidesPerView: 7,
          spaceBetween: 15,
        },
      },
    });
  }
  tamad();
}

async function fetchCompanies(networkId, networkType) {
  const endpoint = `https://api.themoviedb.org/3/discover/${networkType}?api_key=${apiKey}&${
    networkType === "movie" ? "with_companies" : "with_networks"
  }=${networkId}`;

  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}
