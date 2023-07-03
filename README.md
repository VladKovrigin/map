

## Map - a project that allows you to mark points on google maps and attach any objects to these points.
- The project is implemented on the React framework using TypeScript
- Google maps - @react-google-maps/api.
- CSS - react-bootstrap

## To run the project, you need:
1. Clone project files into server catalog
2. Go to root directory of project
3. Run `npm install`
4. Run `npm start`

### Entry point - index.tsx;
The main external dependencies of the project are injected there

### App.tsx - application mount.
Here begins our map page and work with it

### Map.tsx is the main component of a map.
Here we get the Google Map API, process them and the data used as props

### ObjectList.tsx and PointList.tsx
Work with lists of data (objects and points, respectively)

### BaseButton.tsx and BaseInput.tsx
reusable form components