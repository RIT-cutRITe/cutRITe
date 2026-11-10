import type { Description } from '@/types/Description'


const apiResponse = {
    name: 'ABox',
    description: 'This is a mock box description',
    images: ["https://florianfesti.github.io/boxes/static/samples/AngledBox-thumb.jpg","https://florianfesti.github.io/boxes/static/samples/AngledBox-thumb.jpg"]
}

const mockDescription: Description = Object(apiResponse)

export default mockDescription