module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.ts', '.android.ts', '.ts', '.tsx', '.js', '.json'],
        alias: {
          '@app': './src/app',
          '@pages': './src/pages',
          '@widgets': './src/widgets',
          '@features': './src/features',
          '@entities': './src/entities',
          '@shared': './src/shared',
          '@assets': './assets',
        },
      },
    ],
  ],
};
