import NetworkCanvasEngine from '../drawing/NetworkCanvasEngine';
import { useRef } from 'react';

const useNetworkCanvasEngine = () => {
  return useRef(new NetworkCanvasEngine());
};

export default useNetworkCanvasEngine;
