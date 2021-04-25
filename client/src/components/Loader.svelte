<img src="favicon.png" />

<style>
  img {
    margin-top: 10vh;
    animation: rotating 2s linear infinite;
    width: 20vw;
    height: auto;
  }

  @media (max-width: 756px) {
    img {
      width: 60vw;
    }
  }

  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
