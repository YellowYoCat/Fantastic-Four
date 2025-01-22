<template>
  <div class="about-us">
    <h1>About Us</h1>
    <p>
      Welcome to our website! We are passionate about [your mission or focus] and strive to [what you aim to achieve].
    </p>

    <div class="image-gallery">
      <div v-for="(image, index) in images" :key="index" class="image-item">
        <img :src="image.src" :alt="image.alt" />
      </div>
    </div>

    <div class="content">
      <h2>Our Story</h2>
      <p>
        [Add a brief description about the history, mission, or vision of your team or organization.]
      </p>
      <h2>Meet the Team</h2>
      <p>
        [Highlight key members or collaborators who contribute to your work.]
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { src: 'image1.jpg', alt: 'Image 1 description' },
        { src: 'image2.jpg', alt: 'Image 2 description' },
        { src: 'image3.jpg', alt: 'Image 3 description' },
        { src: 'image4.jpg', alt: 'Image 4 description' }
      ]
    };
  }
};
</script>

<style scoped>
.about-us {
  display: flex;
  justify-self: center;
  flex-direction: column;
  text-align: center;
  margin-top: 5%;
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #1974cf;
  color: white;
  width: 600px;
}

.image-gallery {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.image-item img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.content {
  text-align: left;
  margin: 20px auto;
  max-width: 800px;
}

.content h2 {
  margin-top: 20px;
  color: #333;
}

.content p {
  line-height: 1.6;
  color: #555;
}
</style>
