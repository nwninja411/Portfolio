document.addEventListener("DOMContentLoaded", function(){

    let nav = document.querySelector("nav");

    function updateNav(){
        if(!nav){ return; }
        if(window.scrollY > 50){
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    }

    updateNav();
    window.addEventListener("scroll", updateNav);

    const videoViewer = document.getElementById("VideoViewer");

    if(videoViewer && typeof videoViewer.showModal === "function"){
        const player = document.getElementById("VideoPlayer");
        const viewerTitle = document.getElementById("VideoViewerTitle");
        const closeVideo = document.getElementById("VideoViewerClose");
        const fullscreenButton = document.getElementById("VideoFullscreen");
        const viewerPanel = videoViewer.querySelector(".VideoViewerPanel");
        const playerFrame = videoViewer.querySelector(".VideoPlayerFrame");
        const popoutButton = document.getElementById("VideoPopoutDisabled");
        const popoutNotice = document.getElementById("VideoPopoutNotice");
        let activeVideoButton = null;
        let noticeTimeout;

        function clearPopoutNotice(){
            clearTimeout(noticeTimeout);
            popoutNotice.textContent = "";
        }

        popoutButton.addEventListener("click", function(){
            clearTimeout(noticeTimeout);
            popoutNotice.textContent = "Pop-out is disabled. Please watch the video here.";
            noticeTimeout = setTimeout(clearPopoutNotice, 5000);
        });

        // Keep Drive's controls inside its viewport, then scale the whole player to fit.
        const playerResize = new ResizeObserver(function(entries){
            const width = entries[0].contentRect.width;
            const playerWidth = Math.max(640, width);
            player.style.width = playerWidth + "px";
            player.style.height = (playerWidth * 9 / 16) + "px";
            player.style.transform = "scale(" + (width / playerWidth) + ")";
        });
        playerResize.observe(playerFrame);

        document.querySelectorAll(".VideoOpen").forEach(function(button){
            button.addEventListener("click", function(){
                clearPopoutNotice();
                activeVideoButton = button;
                const title = button.closest(".GalItem").querySelector(".GalTitle").textContent;
                viewerTitle.textContent = title;
                player.title = title;
                videoViewer.showModal();
                document.documentElement.classList.add("video-viewer-open");
                player.src = button.dataset.videoSrc;
            });
        });

        closeVideo.addEventListener("click", function(){
            videoViewer.close();
        });

        videoViewer.addEventListener("click", function(event){
            if(event.target !== videoViewer){ return; }
            const bounds = videoViewer.getBoundingClientRect();
            if(event.clientX < bounds.left || event.clientX > bounds.right ||
               event.clientY < bounds.top || event.clientY > bounds.bottom){
                videoViewer.close();
            }
        });

        videoViewer.addEventListener("close", function(){
            clearPopoutNotice();
            // Unloading the embedded player stops its video and audio.
            player.removeAttribute("src");
            document.documentElement.classList.remove("video-viewer-open");
            if(document.fullscreenElement === viewerPanel){
                document.exitFullscreen().catch(function(){});
            }
            if(activeVideoButton){ activeVideoButton.focus({preventScroll: true}); }
        });

        fullscreenButton.hidden = !document.fullscreenEnabled || !viewerPanel.requestFullscreen;
        fullscreenButton.addEventListener("click", async function(){
            try{
                if(document.fullscreenElement){
                    await document.exitFullscreen();
                } else {
                    await viewerPanel.requestFullscreen();
                }
            } catch(error){
                fullscreenButton.hidden = true;
            }
        });

        document.addEventListener("fullscreenchange", function(){
            const isFullscreen = document.fullscreenElement === viewerPanel;
            const label = isFullscreen ? "Exit full screen" : "Full screen";
            fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
            fullscreenButton.setAttribute("aria-label", label);
            fullscreenButton.title = label;
        });
    }

const hamburger = document.getElementById("Hamburger");
const navLinks = document.getElementById("NavLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

/* HERO VIDEO OPTIMIZATION */
const heroVideo = document.getElementById("HeroVideo");

if(heroVideo){

    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                heroVideo.play();
            } else {
                heroVideo.pause();
            }
        });
    },{
        threshold: 0.25
    });

    observer.observe(heroVideo);
}});
