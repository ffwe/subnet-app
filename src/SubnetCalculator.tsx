import React, { useState } from 'react';
import { SubnetResult } from './SubnetResult';
import { calculateSubnetsBySubnetCount, calculateSubnetsByHostCount } from './calculateSubnets';

const SubnetCalculator: React.FC = () => {
  const [networkAddressWithPrefix, setNetworkAddressWithPrefix] = useState<string>('');
  const [desiredSubnets, setDesiredSubnets] = useState<number>(0);
  const [desiredHosts, setDesiredHosts] = useState<number>(0);
  const [subnets, setSubnets] = useState<SubnetResult[]>([]);
  const [calculationType, setCalculationType] = useState<'subnetCount' | 'hostCount'>('subnetCount');

  const calculate = () => {
    const [networkAddress, prefix] = networkAddressWithPrefix.split('/');
    if (calculationType === 'subnetCount') {
      setSubnets(calculateSubnetsBySubnetCount(networkAddress, prefix, desiredSubnets));
    } else {
      setSubnets(calculateSubnetsByHostCount(networkAddress, prefix, desiredHosts));
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="네트워크 주소 (A.B.C.D /prefix)"
        value={networkAddressWithPrefix}
        onChange={(e) => setNetworkAddressWithPrefix(e.target.value)}
      />
      <div>
        <input
          type="radio"
          id="subnetCount"
          name="calculationType"
          value="subnetCount"
          checked={calculationType === 'subnetCount'}
          onChange={() => setCalculationType('subnetCount')}
        />
        <label htmlFor="subnetCount">서브넷 개수</label>
        <input
          type="radio"
          id="hostCount"
          name="calculationType"
          value="hostCount"
          checked={calculationType === 'hostCount'}
          onChange={() => setCalculationType('hostCount')}
        />
        <label htmlFor="hostCount">호스트 개수</label>
      </div>
      {calculationType === 'subnetCount' && (
        <input
          type="number"
          placeholder="원하는 서브넷 개수"
          onChange={(e) => setDesiredSubnets(Number(e.target.value))}
        />
      )}
      {calculationType === 'hostCount' && (
        <input
          type="number"
          placeholder="원하는 호스트 개수"
          onChange={(e) => setDesiredHosts(Number(e.target.value))}
        />
      )}
      <button onClick={calculate}>계산하기</button>

      {subnets.length > 0 && (
        <div>
          <h3>계산 결과:</h3>
          {subnets.map((subnet, index) => (
            <div key={index}>
              <p>subnet {index}: {subnet.networkAddress} /{subnet.prefixSize} {subnet.subnetMask} ({subnet.networkAddress}~{subnet.broadcastAddress})</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubnetCalculator;
