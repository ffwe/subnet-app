// calculateSubnets.ts
import { SubnetResult } from './SubnetResult';
const calculateSubnetAddress = (ipParts: any[], offset: number) => {
  const binaryIP = ipParts.reduce((acc: number, part: number) => (acc << 8) + part, 0) + offset;
  return [24, 16, 8, 0].map(shift => (binaryIP >> shift) & 255);
};

const calculateSubnetMask = (prefixSize: number) => {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const n = Math.min(prefixSize, 8);
    mask.push(-1 << (8 - n) & 255);
    prefixSize -= n;
  }
  return mask;
};

const calculateBroadcastAddress = (subnetAddress: any[], prefixSize: number) => {
  const maskBits = 32 - prefixSize;
  const binarySubnet = subnetAddress.reduce((acc: number, part: number) => (acc << 8) + part, 0);
  const binaryBroadcast = binarySubnet | (Math.pow(2, maskBits) - 1);
  return [24, 16, 8, 0].map(shift => (binaryBroadcast >> shift) & 255);
};

const calculateSubnets = (networkAddress: string, prefix: string, desiredSubnets: number): SubnetResult[] => {
  const ipParts = networkAddress.split('.').map(part => parseInt(part, 10));
  const initialPrefixSize = parseInt(prefix, 10);
  let subnetCount = Math.pow(2, Math.ceil(Math.log(desiredSubnets) / Math.log(2))); // 원하는 서브넷 개수를 2의 거듭제곱으로 조정
  let newPrefixSize = initialPrefixSize + Math.log2(subnetCount); // 새로운 프리픽스 크기 계산
  const subnets = [];

  for (let i = 0; i < subnetCount; i++) {
    const offset = i * Math.pow(2, 32 - newPrefixSize);
    const subnetAddress = calculateSubnetAddress(ipParts, offset);
    const subnetMask = calculateSubnetMask(newPrefixSize);
    const broadcastAddress = calculateBroadcastAddress(subnetAddress, newPrefixSize);

    subnets.push({
      networkAddress: subnetAddress.join('.'),
      prefixSize: newPrefixSize,
      subnetMask: subnetMask.join('.'),
      broadcastAddress: broadcastAddress.join('.'),
    });
  }
  return subnets;
};


export const calculateSubnetsBySubnetCount = (networkAddress: string, prefix: string, desiredSubnets: number): SubnetResult[] => {
  return calculateSubnets(networkAddress, prefix, desiredSubnets);
};

export const calculateSubnetsByHostCount = (networkAddress: string, prefix: string, desiredHosts: number): SubnetResult[] => {
  // 호스트 개수에 따른 서브넷 개수 계산
  const maxHostsPerSubnet = Math.pow(2, 32 - parseInt(prefix, 10)) - 2;
  let requiredSubnets = Math.ceil(desiredHosts / maxHostsPerSubnet);
  requiredSubnets = Math.pow(2, Math.ceil(Math.log(requiredSubnets) / Math.log(2))); // 2의 거듭제곱으로 조정

  return calculateSubnets(networkAddress, prefix, requiredSubnets);
};
