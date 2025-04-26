// Initialize remark slideshow
var slideshow = remark.create({
  ratio: '16:9',
  highlightStyle: 'github',
  highlightLines: true,
  navigation: {
    scroll: false,
    touch: true,
    click: false
  }
});

// Simple but effective content fitting function
window.addEventListener('load', function() {
  maximizeSlideContent();
  // Re-adjust when window is resized
  window.addEventListener('resize', maximizeSlideContent);
});

// Re-adjust content after each slide change
slideshow.on('showSlide', function() {
  setTimeout(maximizeSlideContent, 50);
});

function maximizeSlideContent() {
  // Get all slide containers
  var slideContainers = document.querySelectorAll('.remark-slide-scaler');
  
  slideContainers.forEach(function(container) {
    // Get the content element inside this container
    var content = container.querySelector('.remark-slide-content');
    if (!content) return;
    
    // Reset previous adjustments
    content.style.fontSize = '';
    
    // Get container dimensions
    var containerHeight = container.offsetHeight;
    var containerWidth = container.offsetWidth;
    
    // Start with a baseline font size (depends on device size)
    var baseSize = window.innerWidth <= 480 ? 16 : 24;
    content.style.fontSize = baseSize + 'px';
    
    // Binary search to find the optimal font size
    var minSize = 16;  // Minimum readable size
    var maxSize = 200; // Some large upper bound
    var currentSize = baseSize;
    var bestSize = baseSize;
    var iterations = 0;
    var maxIterations = 10; // Prevent infinite loops
    
    while (minSize <= maxSize && iterations < maxIterations) {
      // Try the current size
      content.style.fontSize = currentSize + 'px';
      
      // Check if content fits
      if (content.scrollHeight <= containerHeight && content.scrollWidth <= containerWidth) {
        // It fits, so this is our new best size
        bestSize = currentSize;
        // Try a larger size
        minSize = currentSize + 1;
      } else {
        // Too big, try a smaller size
        maxSize = currentSize - 1;
      }
      
      // Calculate new size to try (binary search)
      currentSize = Math.floor((minSize + maxSize) / 2);
      iterations++;
    }
    
    // Apply the best size with a safety margin (95% of max to ensure no overflow)
    content.style.fontSize = (bestSize * 0.95) + 'px';
    
    // After sizing, ensure content is vertically centered
    if (!content.querySelector('.middle') && !content.classList.contains('middle')) {
      content.style.justifyContent = 'center';
    }
  });
}

// Ensure proper PDF rendering
if (typeof window.matchMedia === 'function') {
  var mediaQueryList = window.matchMedia('print');
  mediaQueryList.addListener(function(mql) {
    if (mql.matches) {
      // Before print - ensure content fits
      maximizeSlideContent();
    }
  });
}
