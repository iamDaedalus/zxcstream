const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalYear = document.getElementById("modalYear");
const modalRuntime = document.getElementById("modalRuntime");
const modalGenre = document.getElementById("modalGenre");
const modalOverviewBtn = document.getElementById("modalOverviewBtn");
const modalEpisodeBtn = document.getElementById("modalEpisodeBtn");
const modalTrailerBtn = document.getElementById("modalTrailerBtn");
const modalOverview = document.getElementById("modalOverview");
const modalPlay = document.querySelector(".modalPlay");
const modalWrapper = document.querySelector(".modalWrapper");
const modalWrapperImage = document.createElement("img");
modalWrapperImage.className = "modalWrapperImage";
async function modalFunction(data) {
  document.body.style.overflow = "hidden";
  modalPoster.dataset.src = data.poster;
  modalPoster.classList.add("lazy-load");
  modalPoster.style.border = "none";
  modalTitle.innerText = data.title;
  modalYear.innerText = data.year;
  modalRuntime.innerText = data.run;
  modalGenre.innerText = data.genre;

  modalWrapperImage.src = data.poster;
  modalWrapper.appendChild(modalWrapperImage);

  modalOverviewBtn.classList.add("activeButton");
  modalOverview.innerHTML = `
  <p>${data.overview}</p>
  <div class="swiper-container" id="castContainer">
   <div class="swiper-wrapper" id="castWrapper"></div>
   </div>
  `;
  actorFunction(data);

  modalOverviewBtn.addEventListener("click", () => {
    modalOverviewBtn.classList.add("activeButton");
    modalTrailerBtn.classList.remove("activeButton");
    modalEpisodeBtn.classList.remove("activeButton");
    modalOverview.innerHTML = `
  <p>${data.overview}</p>
   <div class="swiper-container" id="castContainer">
   <div class="swiper-wrapper" id="castWrapper"></div>
   </div>
  `;
    actorFunction(data);
    swiperModal();
    tamad();
  });

  modalTrailerBtn.addEventListener("click", () => {
    modalOverviewBtn.classList.remove("activeButton");
    modalTrailerBtn.classList.add("activeButton");
    modalEpisodeBtn.classList.remove("activeButton");
    modalOverview.innerHTML = `
     <iframe class="modalTrailer" src="${data.trailer}"
       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>></iframe>
    `;
  });

  if (data.mediaType === "tv") {
    modalEpisodeBtn.style.display = "block";
    modalEpisodeBtn.addEventListener("click", () => {
      // Handle active button styling
      modalOverviewBtn.classList.remove("activeButton");
      modalTrailerBtn.classList.remove("activeButton");
      modalEpisodeBtn.classList.add("activeButton");

      // Clear modal overview content
      modalOverview.innerHTML = "";

      // Create season and episode containers
      const seasonContainer = document.createElement("div");
      seasonContainer.className = "seasonContainer swiper-container";

      const seasonWrapper = document.createElement("div");
      seasonWrapper.className = "swiper-wrapper";

      const episodeContainer = document.createElement("div");
      episodeContainer.className = "episodeContainer";

      // Loop through seasons
      data.season.forEach((season, index) => {
        const seasonSlide = document.createElement("div");
        seasonSlide.className = "seasonSlide swiper-slide";
        seasonSlide.innerHTML = `<h1>${season.name}</h1>`;
        seasonWrapper.appendChild(seasonSlide);

        // Click event for each season slide
        seasonSlide.addEventListener("click", async () => {
          episodeContainer.innerHTML = ""; // Clear episode container
          try {
            const episodeData = await fetchSeason(
              data.id,
              season.season_number
            );
            episodeData.forEach((episode) => {
              // console.log(episode);
              const episodeSlide = document.createElement("div");
              episodeSlide.className = "episodeSlide";
              episodeSlide.innerHTML = `
              <div class="episodeImageContainer">
                <img class="lazy-load" data-src="${episode.episodeImage}" alt="${episode.episodeName}" />
              </div>
              <div class="episodeNameContainer">
                <h2>E${episode.episodeNumber}. ${episode.episodeName}</h2>
                <p>${episode.episodeOverview}</p>
              </div>
            `;
              episodeContainer.appendChild(episodeSlide);

              episodeSlide.addEventListener("click", () => {
                iframePlayer.classList.add("iframePlayerActive");
                sourcePlayer(
                  data.id,
                  "tv",
                  season.season_number,
                  episode.episodeNumber
                );
              });
            });

            // Reinitialize lazy loading if needed
            tamad();
          } catch (error) {
            console.error("Error fetching episodes:", error);
          }
        });

        // Automatically trigger the first season
        if (index === 0) {
          seasonSlide.click();
        }
      });

      // Append season wrapper to the container
      seasonContainer.appendChild(seasonWrapper);

      // Append containers to modal overview
      modalOverview.appendChild(seasonContainer);
      modalOverview.appendChild(episodeContainer);

      // Reinitialize Swiper and lazy loading
      swiperModal();
      tamad();
    });
  }

  swiperModal();
  tamad();
  closeModalFunction();
}

function closeModalFunction() {
  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    modalPoster.src = "";
    modalTitle.innerText = "TITLE";
    modalOverview.innerHTML = "";
    modalYear.innerText = "YEAR";
    modalRuntime.innerText = "RUNTIME";
    modalGenre.innerText = "GENRE";
    modalOverviewBtn.classList.remove("activeButton");
    modalTrailerBtn.classList.remove("activeButton");
    modalEpisodeBtn.classList.remove("activeButton");
    modalEpisodeBtn.style.display = "none";
    modalWrapperImage.src = "";
  });
}

function actorFunction(data) {
  const castWrapper = document.getElementById("castWrapper");
  data.actor.forEach((meow) => {
    const castimageContainer = document.createElement("div");
    castimageContainer.className = "castimageContainer";
    castimageContainer.classList.add("swiper-slide");
    const castimage = document.createElement("img");
    castimage.className = "castimage";
    castimage.classList.add("lazy-load");
    castimage.dataset.src = meow.actorImage;
    const castName = document.createElement("p");
    castName.className = "castName";
    castName.innerText = `${meow.actorName} as ${meow.actorChar}`;
    castimageContainer.appendChild(castimage);
    castimageContainer.appendChild(castName);

    castWrapper.appendChild(castimageContainer);
  });

  modalPlay.addEventListener("click", () => {
    iframePlayer.classList.add("iframePlayerActive");
    sourcePlayer(data.id, data.mediaType, "1", "1");
  });
}

function swiperModal() {
  console.log("swiper");
  new Swiper(".swiper-container", {
    slidesPerView: "auto",
    spaceBetween: 10,
  });
}
