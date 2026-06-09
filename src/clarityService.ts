/**
 * @function initClarity
 * @description Dynamically injects the Microsoft Clarity analytics script into the document head.
 * This ensures the script is only loaded when explicitly called (e.g., in production environments).
 * @returns {void}
 */
export const initClarity = (): void => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  
  // Injecting the Clarity execution logic
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vu7wyj6qw2");
  `;

  document.head.appendChild(script);
};