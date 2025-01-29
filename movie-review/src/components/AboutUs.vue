<template>
  <div class="about-us">
    <h1>About Us</h1>
    <p>
      Welcome to Fantastic Reviews, your go-to destination for in-depth and engaging movie reviews! We are a team of
      passionate developers inspired by the power of storytelling, dedicated to helping you navigate the vast world of
      cinema. From timeless classics to the latest blockbusters, our mission is to provide honest, insightful, and
      entertaining reviews to spark your love for film..
    </p>

    <div class="image-gallery">
      <div v-for="(image, index) in images" :key="index" class="image-item">
        <img :src="image.src" :alt="image.alt" />
      </div>
    </div>

    <div class="content">
      <h2>Our Story</h2>
      <p>
        Fantastic Reviews was born out of a shared love for movies and lively debates among four unique individuals.
        Much like the Fantastic Four, each member of our team brings their own "superpower" to the table: critical
        analysis, visual creativity, sharp wit, and a keen sense for storytelling. Our goal is to unite movie lovers
        worldwide, offering a platform to celebrate and critique the magic of cinema. We aim to build a community that
        explores the best (and sometimes the worst) of what the film industry has to offer.
      </p>
      <h2>Meet the Team</h2>
      <p>
        <i>Our team is made up of four film enthusiasts who form an unbeatable review squad:</i>
      </p>

      <p>
        <bold>Mr. Fantastic (Erin):</bold> The analytical mastermind who dives deep into a film’s structure, themes, and nuances to
        deliver thoughtful critiques.
      </p>
      <p>
        <bold>Invisible Woman (Chelsea):</bold> The heart of the team, with an eye for visual storytelling and artistic direction
        that makes a movie stand out.
      </p>
      <p>
        <bold>The Thing (Lauren):</bold> Our tough but fair reviewer who doesn’t shy away from calling out flaws but celebrates the
        raw charm of a good film.
      </p>
      <p>
        <bold>Human Torch (Johanna):</bold> The fun and fiery spirit who adds humor, passion, and excitement to our reviews, making
        each one a blast to read.
        Together, we’re here to guide you through the cinematic universe, ensuring your next watch is always fantastic!
      </p>
    </div>
  </div>
  <br>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { src: require('@/assets/marvel-rivals-mister-fantastic-mvp-screen-1.avif'), alt: 'Mr Fantastic' },
        { src: require('@/assets/marvel-rivals-invisible-woman-trailer-1.avif'), alt: 'Invisible Woman' },
        { src: require('@/assets/theThing.jpg'), alt: 'The Thing' },
        { src: require('@/assets/human-torch.jpg'), alt: 'Human Torch' }
      ]
    };
  }
};
</script>
